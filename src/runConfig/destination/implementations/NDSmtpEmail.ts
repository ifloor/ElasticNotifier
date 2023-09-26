import {Logger} from "../../../utils/Logger";
import {MonitoringRecord} from "../../../elastic/MonitoringRecord";
import moment from "moment";
const nodemailer = require("nodemailer");

export class NDSmtpEmail {
    private static readonly Host: string = "host";
    private static readonly Port: string = "port";
    private static readonly AuthUser: string = "auth-user";
    private static readonly AuthPass: string = "auth-pass";
    private static readonly FromEmail: string = "from-email";
    private static readonly DestinationEmail: string = "destination-email";

    private readonly _host: string;
    private readonly _port: string;
    private readonly _authUser: string;
    private readonly _authPass: string;
    private readonly _fromEmail: string;
    private readonly _destinationEmail: string;

    private readonly _transporter: any;

    constructor(objectToParse: any) {

        let hostRaw = objectToParse[`${NDSmtpEmail.Host}`];
        if (hostRaw == null) {
            Logger.error(`Node ${NDSmtpEmail.Host} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._host = hostRaw;

        let portRaw = objectToParse[`${NDSmtpEmail.Port}`];
        if (portRaw == null) {
            Logger.error(`Node ${NDSmtpEmail.Port} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._port = portRaw;

        let authUserRaw = objectToParse[`${NDSmtpEmail.AuthUser}`];
        if (authUserRaw == null) {
            Logger.error(`Node ${NDSmtpEmail.AuthUser} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._authUser = authUserRaw;

        let authPassRaw = objectToParse[`${NDSmtpEmail.AuthPass}`];
        if (authPassRaw == null) {
            Logger.error(`Node ${NDSmtpEmail.AuthPass} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._authPass = authPassRaw;

        let fromEmailRaw = objectToParse[`${NDSmtpEmail.FromEmail}`];
        if (fromEmailRaw == null) {
            Logger.error(`Node ${NDSmtpEmail.FromEmail} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._fromEmail = fromEmailRaw;

        let destinationEmailRaw = objectToParse[`${NDSmtpEmail.DestinationEmail}`];
        if (destinationEmailRaw == null) {
            Logger.error(`Node ${NDSmtpEmail.DestinationEmail} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._destinationEmail = destinationEmailRaw;

        this._transporter = nodemailer.createTransport({
            host: this._host,
            port: this._port,
            auth: {
                user: this._authUser,
                pass: this._authPass
            }
        });

    }

    public notify(monitoringRecord: MonitoringRecord) {
        let title = monitoringRecord.getTitle();
        if (title == null) {
            title = "N/A";
        }

        let author = monitoringRecord.getAuthor();
        if (author == null) {
            author = "N/A";
        }

        let messageUrl = monitoringRecord.getMessageUrl();
        if (messageUrl == null) {
            messageUrl = "";
        }

        let color = monitoringRecord.getColor();
        if (color == null) {
            color = 0x0078D7;
        }

        let thumbnail = monitoringRecord.getThumbnail();
        if (thumbnail == null) {
            thumbnail = "";
        }

        let description = monitoringRecord.getDescription();
        if (description == null) {
            description = "N/A";
        }

        let image = monitoringRecord.getImage();
        if (image == null) {
            image = "https://i2.wp.com/oraex.com.br/wp-content/uploads/2019/04/img_Elasticsearch_interna.png";
        }

        let footer = monitoringRecord.getFooter();
        if (footer == null) {
            footer = "";
        }

        const formattedDate: string = moment().format("DD/MM/YY, HH:mm");
        const notificationText = `Author: ${author}\n` +
            `Description: ${description}\n` +
            `Footer: ${footer}\n` +
            `Message url: ${messageUrl}\n` +
            `Image: ${image}\n` +
            `Thumbnail: ${thumbnail}\n` +
            `Date: ${formattedDate}`;

        const message = {
            from: this._fromEmail,
            to: this._destinationEmail,
            subject: title,
            text: notificationText
        }

        this._transporter.sendMail(message, function(err: any, info: any) {
            if (err != null) {
                Logger.error(`Error when sending mail: ${JSON.stringify(err)}`);
            }

            if (info != null) {
                Logger.info(`Info when sending mail: ${JSON.stringify(info)}`);
            }
        });
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} Host: ${this._host}`);
        Logger.warn(`${deepness} Port: ${this._port}`);
        Logger.warn(`${deepness} AuthUser: ${this._authUser}`);
        Logger.warn(`${deepness} AuthPass: **********`);
        Logger.warn(`${deepness} FromEmail: ${this._fromEmail}`);
        Logger.warn(`${deepness} DestinationEmail: ${this._destinationEmail}`);
    }
}