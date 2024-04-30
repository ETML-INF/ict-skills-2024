import {
  AggregatedResult,
  Config,
  Reporter,
  ReporterOnStartOptions,
  Test,
  TestResult,
} from "@jest/reporters";
import { TestContext } from "@jest/test-result";
import { TestRun } from "@skills17/test-result";
import * as NodeConfig from "@skills17/task-config";
import * as Printer from "@skills17/test-result-printer";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

const TaskConfig = ((NodeConfig as any).default as any).default;
const TestResultPrinter = ((Printer as any).default as any).default;

export default class Skills17JestReporter implements Reporter {
  protected _globalConfig: Config.GlobalConfig;
  private readonly isJson: boolean;
  private readonly config: NodeConfig.default;
  public testRun: TestRun;

  constructor(globalConfig: Config.GlobalConfig, options?: any) {
    this._globalConfig = globalConfig;
    this.isJson = !!options.json;

    this.config = new TaskConfig();
    this.config.loadFromFileSync();
  }

  log(message: string): void {
    if (!this.isJson) {
      console.log(`[LOG] ${message}`);
    }
  }

  onRunStart(
    _aggregatedResults: AggregatedResult,
    _options: ReporterOnStartOptions
  ): void {
    this.testRun = this.config.createTestRun();
  }

  onTestStart(_test?: Test): void {
    // nop
  }

  onTestResult(
    test: Test,
    testResult: TestResult,
    _aggregatedResults: AggregatedResult
  ): void {
    const isExtra = test.path.includes("/extra/");
    testResult.testResults.forEach((result) => {
      this.testRun.recordTest(
        `${result.ancestorTitles.join(" > ")} > ${result.title}`,
        result.title,
        isExtra,
        result.status === "passed"
      );
    });
  }

  onRunComplete(
    _test?: Set<TestContext>,
    _runResults?: AggregatedResult
  ): Promise<void> | void {
    if (this.isJson) {
      console.log(JSON.stringify(this.testRun.toJSON(), null, 2));
    } else {
      const printer: Printer.default = new TestResultPrinter(this.testRun);
      console.log();
      printer.print({
        printFooter: true,
        printPoints: this.config.arePointsDisplayed(),
      });
    }

    if (this.config.isLocalHistoryEnabled()) {
      this.storeTestRun(this.config, this.testRun);
    }
  }

  private storeTestRun(config: NodeConfig.default, testRun: TestRun): void {
    const historyDir = path.resolve(config.getProjectRoot(), ".history");
    const historyFile = path.resolve(historyDir, `${uniqid()}.json`);

    // create history dir if it doesn't exist
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir);
    }

    // write history file
    fs.writeFileSync(
      historyFile,
      JSON.stringify(
        { time: Math.round(new Date().getTime() / 1000), ...testRun.toJSON() },
        undefined,
        2
      )
    );
  }
}