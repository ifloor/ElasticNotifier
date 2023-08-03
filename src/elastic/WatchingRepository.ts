import {Client} from "@elastic/elasticsearch";
import {ElasticClient} from "./ElasticClient";
import {Logger} from "../utils/Logger";
import {MonitoringRecord} from "./MonitoringRecord";
import {Promise} from "bluebird";

export class WatchingRepository {
    private readonly _elasticClient: Client;
    private readonly _watchingTopic: string;


    constructor(configurationClient: ElasticClient, watchingTopic: string) {
        this._elasticClient = configurationClient.elasticClient;
        this._watchingTopic = watchingTopic;
    }

    public getMostRecentMonitoring(): Promise<MonitoringRecord | null> {
        return new Promise((resolve, reject) => {
            this._elasticClient.search({
                index: this._watchingTopic,
                body: {},
                size: 1,
                sort: "@timestamp:desc",
            }, {
                maxRetries: 10,
            }, (err, result) => {
                if (err != null) {
                    Logger.error(`Error on search: ${err}`);
                    reject(err);
                    return;
                }

                if (result != null) {
                    Logger.debug(`response body: ${JSON.stringify(result.body)}`);

                    let hits: any[] = result.body.hits.hits;
                    if (hits.length == 0) {
                        Logger.debug("No previous monitoring data found");
                        resolve(null);
                        return;
                    }

                    Logger.debug(`Found records: ${hits.length}`);
                    let monitoringRecord: MonitoringRecord = new MonitoringRecord(hits[0]);
                    resolve(monitoringRecord);
                }
            });
        });
    }

    public getRecordsOlderThan(timestamp: string): Promise<Array<MonitoringRecord>> {
        return new Promise((resolve, reject) => {
            this._elasticClient.search({
                index: this._watchingTopic,
                body: {
                    "query": {
                        "range": {
                            "@timestamp": {
                                "gt": timestamp
                            }
                        }
                    }
                },
                size: 1000,
                sort: "@timestamp:asc",
            }, {
                maxRetries: 10,
            }, (err, result) => {
                if (err != null) {
                    Logger.error(`Error on search: ${err}`);
                    reject(err);
                    return;
                }

                if (result != null) {
                    Logger.debug(`response body: ${JSON.stringify(result.body)}`);

                    let hits: any[] = result.body.hits.hits;
                    let monitoringRecords: MonitoringRecord[] = new Array();

                    hits.forEach(hit => {
                        const monitoringRecord: MonitoringRecord = new MonitoringRecord(hit);
                        monitoringRecords.push(monitoringRecord);
                    })

                    resolve(monitoringRecords);
                }
            });
        })
    }
}