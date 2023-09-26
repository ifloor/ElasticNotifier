import {Logger} from "../../utils/Logger";
import {ElasticConfig} from "../elastic/ElasticConfig";
import {NotificationProcessor} from "../processor/NotificationProcessor";

export class RootConfig {
    private static readonly ElasticConfigNode: string = "elastic-config";
    private static readonly WatchIndexNode: string = "watch-index";
    private static readonly WatchSecondsIntervalNode: string = "watch-seconds-interval";
    private static readonly NotificationProcessorsNode: string = "notification-processors";

    private readonly _elasticConfig: ElasticConfig;
    private readonly _watchIndex: string;
    private readonly _watchSecondsInterval: number;
    private readonly _notificationProcessors: NotificationProcessor[];

    constructor(objectToParse: any) {
        let elasticConfigRaw = objectToParse[`${RootConfig.ElasticConfigNode}`];
        if (elasticConfigRaw == null) {
            Logger.error(`Node ${RootConfig.ElasticConfigNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._elasticConfig = new ElasticConfig(elasticConfigRaw);

        let watchIndexRaw = objectToParse[`${RootConfig.WatchIndexNode}`];
        if (watchIndexRaw == null) {
            Logger.error(`Node ${RootConfig.WatchIndexNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._watchIndex = watchIndexRaw;

        let _watchSecondsIntervalRaw = objectToParse[`${RootConfig.WatchSecondsIntervalNode}`];
        if (_watchSecondsIntervalRaw == null) {
            Logger.error(`Node ${RootConfig.WatchSecondsIntervalNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._watchSecondsInterval = _watchSecondsIntervalRaw;

        let notificationProcessorsRaw = objectToParse[`${RootConfig.NotificationProcessorsNode}`]
        if (notificationProcessorsRaw == null) {
            Logger.error(`Node ${RootConfig.NotificationProcessorsNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }

        this._notificationProcessors = [];
        for(let i=0; i < notificationProcessorsRaw.length; i++){
            let processorRaw = notificationProcessorsRaw[i];
            let processor = new NotificationProcessor(processorRaw);
            this._notificationProcessors.push(processor);
        }

        if (this._notificationProcessors.length == 0) {
            Logger.warn(`Strangely, no notification processor was defined?`);
        }
    }

    public logStructure(): void {
        this._elasticConfig.logStructure("   ");
        Logger.warn(`Watching index: ${this._watchIndex}`);

        this._notificationProcessors.forEach((processor) => {
           processor.logStructure("   ");
        });
    }

    get elasticConfig(): ElasticConfig {
        return this._elasticConfig;
    }

    get watchIndex(): string {
        return this._watchIndex;
    }

    get notificationProcessors(): NotificationProcessor[] {
        return this._notificationProcessors;
    }


    get watchSecondsInterval(): number {
        return this._watchSecondsInterval;
    }
}