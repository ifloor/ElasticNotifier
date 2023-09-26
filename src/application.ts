import {Logger} from "./utils/Logger";
import {VariablesExtractor} from "./utils/VariablesExtractor";
import {RootConfig} from "./runConfig/root/RootConfig";
import {Watcher} from "./watcher/Watcher";

let extractor = new VariablesExtractor();

// Log level
const logLevel = extractor.getLogLevel();
if (logLevel == "TRACE") {
    Logger.setLevel(Logger.LogLevelEnum.TRACE);
} else if (logLevel == "DEBUG") {
    Logger.setLevel(Logger.LogLevelEnum.DEBUG);
} else if (logLevel == "INFO") {
    Logger.setLevel(Logger.LogLevelEnum.INFO);
} else if (logLevel == "WARN") {
    Logger.setLevel(Logger.LogLevelEnum.WARN);
} else if (logLevel == "ERROR") {
    Logger.setLevel(Logger.LogLevelEnum.ERROR);
} else {
    Logger.setLevel(Logger.LogLevelEnum.INFO); // Default value
}


let config = extractor.getRootConfig();

let jsonConfig;
try {
    jsonConfig = JSON.parse(config);
} catch (exception) {
    Logger.error(`Error when parsing json: ${config}`);
    Logger.error(`${exception}`);

    process.exit(-1);
}

let rootConfig: RootConfig = new RootConfig(jsonConfig);
rootConfig.logStructure();

let watcher: Watcher = new Watcher(rootConfig);