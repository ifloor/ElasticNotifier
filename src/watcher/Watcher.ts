import {RootConfig} from "../runConfig/RootConfig";
import {Logger} from "../utils/Logger";
import {ElasticClient} from "../elastic/ElasticClient";
import {WatchingRepository} from "../elastic/WatchingRepository";
import {MonitoringRecord} from "../elastic/MonitoringRecord";
import {NotificationProcessor} from "../runConfig/NotificationProcessor";

export class Watcher {

    private readonly _elasticClient: ElasticClient;
    private readonly _watchingRepository: WatchingRepository;
    private readonly _watchingIntervalSeconds: number;

    private  _lastFetchMonitoring: string = "";

    private loadedNotificationProcessors: Map<string, NotificationProcessor> = new Map();

    constructor(rootConfig: RootConfig) {
        Logger.info("Starting watcher...");

        this._elasticClient = new ElasticClient(rootConfig.elasticConfig);

        this._watchingRepository = new WatchingRepository(this._elasticClient, rootConfig.watchIndex);

        this._watchingIntervalSeconds = rootConfig.watchSecondsInterval;

        this.loadNotificationProcessors(rootConfig.notificationProcessors);

        this.startWatching();
    }

    private loadNotificationProcessors(notificationProcessors: NotificationProcessor[]): void {
        notificationProcessors.forEach(processor => {
            this.loadedNotificationProcessors.set(processor.forTag, processor);
        });
    }

    private startWatching(): void {
        let mostRecentMonitoringPromise: Promise<MonitoringRecord | null> = this._watchingRepository.getMostRecentMonitoring();

        mostRecentMonitoringPromise.then(monitoringRecord => {
            if (monitoringRecord == null) {
                Logger.info("Assuming now as the last timestamp fetched...");
                this._lastFetchMonitoring = "2000-01-00T01:00:00.540Z";
                return;
            }

            this._lastFetchMonitoring = monitoringRecord.getTimestamp();
            Logger.info(`From the found record, considering this timestamp to next fetches: ${this._lastFetchMonitoring}`);

            this.doWatch();
        }).catch(reason => {
            Logger.error(`Error when fetching most recent monitoring: ${reason}. Impossible to proceed...`);
            process.exit(-1);
        });
    }

    private doWatch(): void {
        this._watchingRepository.getRecordsOlderThan(this._lastFetchMonitoring)
            .then(monitoringRecords => {
                Logger.info(`Got monitoring records: ${monitoringRecords.length}`);

                monitoringRecords.forEach(monitoringRecord => {
                   this.notify(monitoringRecord);
                   this._lastFetchMonitoring = monitoringRecord.getTimestamp();
                });

                this.scheduleNextWatch();
            }).catch(reason => {
                Logger.error(`Error when fetching new monitoring data from elastic :/ ${reason}. Will wait for the interval and try again`)
                this.scheduleNextWatch();
            });
    }

    private scheduleNextWatch(): void {
        setTimeout(() => {
            this.doWatch();
        }, this._watchingIntervalSeconds * 1000);
    }

    private notify(monitoringRecord: MonitoringRecord): void {
        const tag = monitoringRecord.getTag();
        Logger.info(`Monitoring found! Tag: ${tag}`);

        if (tag == null) {
            Logger.warn("Monitoring without tag, skipping...");
            Logger.info(`Original source: ${monitoringRecord.getSource()}`);
            return;
        }

        if (! this.loadedNotificationProcessors.has(tag)) {
            Logger.warn("No processor found for tag, skipping...");
            return;
        }

        // @ts-ignore
        let processor: NotificationProcessor = this.loadedNotificationProcessors.get(tag);
        processor.destinations.forEach(destination => {
            destination.notify(monitoringRecord);
        });
    }
}