import { JestConfigWithTsJest } from "ts-jest";

const jsonOnlyReport = !!process.env["SKILLS17_JSON"];

const config: JestConfigWithTsJest = {
  clearMocks: true,
  reporters: jsonOnlyReport
    ? [["./skills17-jest-reporter", { json: jsonOnlyReport }]]
    : ["default", "./skills17-jest-reporter"],
  testEnvironment: "node",
  preset: "ts-jest",
};

export default config;
