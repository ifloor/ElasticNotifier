import {Logger} from "../utils/Logger";
import {NotificationDestinationType} from "./NotificationDestinationType";
import {NDDiscord} from "./NDDiscord";
import {MonitoringRecord} from "../elastic/MonitoringRecord";
import {NDMicrosoftTeams} from "./NDMicrosoftTeams";
import {NDSmtpEmail} from "./NDSmtpEmail";
import {NDHttpRequest} from "./NDHttpRequest";

export class NotificationDestination {
    private static readonly TypeNode: string = "type";

    private readonly _type: NotificationDestinationType | null = null;
    private readonly _discord: NDDiscord | null = null;
    private readonly _microsoftTeams: NDMicrosoftTeams | null = null;
    private readonly _smtpEmail: NDSmtpEmail | null = null;
    private readonly _httpRequest: NDHttpRequest | null = null;

    constructor(objectToParse: any) {
        let typeRaw = objectToParse[`${NotificationDestination.TypeNode}`]
        if (typeRaw == null) {
            Logger.error(`Node ${NotificationDestination.TypeNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }

        if (typeRaw.toUpperCase() == NotificationDestinationType.DISCORD) {
            this._type = NotificationDestinationType.DISCORD;
        } else if (typeRaw.toUpperCase() == NotificationDestinationType.MICROSOFT_TEAMS.toString()) {
            this._type = NotificationDestinationType.MICROSOFT_TEAMS;
        } else if (typeRaw.toUpperCase() == NotificationDestinationType.SMTP_EMAIL.toString()) {
            this._type = NotificationDestinationType.SMTP_EMAIL;
        } else if (typeRaw.toUpperCase() == NotificationDestinationType.HTTP_REQUEST.toString()) {
            this._type = NotificationDestinationType.HTTP_REQUEST;
        } else {
            Logger.warn(`Type ${typeRaw.toUpperCase()} not recognized. Skipping`);
        }

        switch (this._type) {
            case NotificationDestinationType.DISCORD:
                this._discord = new NDDiscord(objectToParse);
                break;

            case NotificationDestinationType.MICROSOFT_TEAMS:
                this._microsoftTeams = new NDMicrosoftTeams(objectToParse);
                break;

            case NotificationDestinationType.SMTP_EMAIL:
                this._smtpEmail = new NDSmtpEmail(objectToParse);
                break;

            case NotificationDestinationType.HTTP_REQUEST:
                this._httpRequest = new NDHttpRequest(objectToParse);
                break;

            default:
                break;
        }
    }

    public notify(monitoringRecord: MonitoringRecord) {
        Logger.debug(`Monitoring record: ${JSON.stringify(monitoringRecord)}`);

        switch (this._type) {
            case NotificationDestinationType.DISCORD:
                this._discord?.notify(monitoringRecord);
                break;

            case NotificationDestinationType.MICROSOFT_TEAMS:
                this._microsoftTeams?.notify(monitoringRecord);
                break;

            case NotificationDestinationType.SMTP_EMAIL:
                this._smtpEmail?.notify(monitoringRecord);
                break;

            case NotificationDestinationType.HTTP_REQUEST:
                this._httpRequest?.notify(monitoringRecord);
                break;
        }
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} Destination type: ${this._type}`);
        switch (this._type) {
            case NotificationDestinationType.DISCORD:
                this._discord?.logStructure(deepness + "   ");
                break;

            case NotificationDestinationType.MICROSOFT_TEAMS:
                this._microsoftTeams?.logStructure(deepness + "   ");
                break;

            case NotificationDestinationType.SMTP_EMAIL:
                this._smtpEmail?.logStructure(deepness + "   ");
                break;

            case NotificationDestinationType.HTTP_REQUEST:
                this._httpRequest?.logStructure(deepness + "   ");
                break;
        }
    }

    get type(): NotificationDestinationType | null {
        return this._type;
    }
}