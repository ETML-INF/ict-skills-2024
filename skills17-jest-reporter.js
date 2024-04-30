import * as NodeConfig from "@skills17/task-config";
import * as Printer from "@skills17/test-result-printer";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";
const TaskConfig = NodeConfig.default.default;
const TestResultPrinter = Printer.default.default;
export default class Skills17JestReporter {
    _globalConfig;
    isJson;
    config;
    testRun;
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this.isJson = !!options.json;
        this.config = new TaskConfig();
        this.config.loadFromFileSync();
    }
    log(message) {
        if (!this.isJson) {
            console.log(`[LOG] ${message}`);
        }
    }
    onRunStart(_aggregatedResults, _options) {
        this.testRun = this.config.createTestRun();
    }
    onTestStart(_test) {
        // nop
    }
    onTestResult(test, testResult, _aggregatedResults) {
        const isExtra = test.path.includes("/extra/");
        testResult.testResults.forEach((result) => {
            this.testRun.recordTest(`${result.ancestorTitles.join(" > ")} > ${result.title}`, result.title, isExtra, result.status === "passed");
        });
    }
    onRunComplete(_test, _runResults) {
        if (this.isJson) {
            console.log(JSON.stringify(this.testRun.toJSON(), null, 2));
        }
        else {
            const printer = new TestResultPrinter(this.testRun);
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
    storeTestRun(config, testRun) {
        const historyDir = path.resolve(config.getProjectRoot(), ".history");
        const historyFile = path.resolve(historyDir, `${uniqid()}.json`);
        // create history dir if it doesn't exist
        if (!fs.existsSync(historyDir)) {
            fs.mkdirSync(historyDir);
        }
        // write history file
        fs.writeFileSync(historyFile, JSON.stringify({ time: Math.round(new Date().getTime() / 1000), ...testRun.toJSON() }, undefined, 2));
    }
}
