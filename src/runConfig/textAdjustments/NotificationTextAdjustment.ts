import {Logger} from "../../utils/Logger";
import {MonitoringRecord} from "../../elastic/MonitoringRecord";
import {NotificationTextAdjustmentType} from "./NotificationTextAdjustmentType";
import {NTAJQ} from "./implementations/NTAJQ";

export class NotificationTextAdjustment {
    private static readonly TypeNode: string = "type";

    private readonly _type: NotificationTextAdjustmentType | null = null;
    private readonly _jq: NTAJQ | null = null;

    constructor(objectToParse: any) {
        let typeRaw = objectToParse[`${NotificationTextAdjustment.TypeNode}`]
        if (typeRaw === null) {
            Logger.error(`Node [${NotificationTextAdjustment.TypeNode}] not specified. Impossible to proceed. Node: ${JSON.stringify(objectToParse)}`);
            process.exit(-1);
        }

        if (typeRaw.toUpperCase() == NotificationTextAdjustmentType.JQ) {
            this._type = NotificationTextAdjustmentType.JQ;
        } else {
            Logger.warn(`Type ${typeRaw.toUpperCase()} not recognized. Skipping`);
        }

        switch (this._type) {
            case NotificationTextAdjustmentType.JQ:
                this._jq = new NTAJQ(objectToParse);
                break;

            default:
                break;
        }
    }

    public async adjust(monitoringRecord: MonitoringRecord): Promise<MonitoringRecord> {
        Logger.debug(`Monitoring record: ${JSON.stringify(monitoringRecord)}`);

        switch (this._type) {
            case NotificationTextAdjustmentType.JQ:
                return await this._jq!.adjust(monitoringRecord);

        }

        return monitoringRecord
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} Destination type: ${this._type}`);
        switch (this._type) {
            case NotificationTextAdjustmentType.JQ:
                this._jq?.logStructure(deepness + "   ");
                break;

        }
    }

    get type(): NotificationTextAdjustmentType | null {
        return this._type;
    }
}