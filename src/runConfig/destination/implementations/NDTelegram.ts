import {Logger} from "../../../utils/Logger";
import {MonitoringRecord} from "../../../elastic/MonitoringRecord";
import axios from "axios";

const https = require('https');

export class NDTelegram {
    private static readonly BotToken: string = "bot-token";
    private static readonly ChatId: string = "chat-id";
    private static readonly ParseMode: string = "parse-mode";
    private static readonly MessageThreadId: string = "message-thread-id";


    private readonly _botToken: string;
    private readonly _chatId: string;
    private readonly _parseMode: string;
    private readonly _messageThreadId: string | null = null;

    constructor(objectToParse: any) {
        {
            let botTokenRaw = objectToParse[`${NDTelegram.BotToken}`];
            if (botTokenRaw == null) {
                Logger.error(`Node ${NDTelegram.BotToken} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._botToken = botTokenRaw;
        }
        {
            let chatIdRaw = objectToParse[`${NDTelegram.ChatId}`];
            if (chatIdRaw == null) {
                Logger.error(`Node ${NDTelegram.ChatId} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._chatId = chatIdRaw;
        }
        {
            let parseModeRaw = objectToParse[`${NDTelegram.ParseMode}`];
            if (parseModeRaw == null) {
                Logger.error(`Node ${NDTelegram.ParseMode} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._parseMode = parseModeRaw;
        }
        // Optionals
        {
            let messageThreadIdRaw = objectToParse[`${NDTelegram.MessageThreadId}`];
            if (messageThreadIdRaw == null) {
                Logger.info(`Node ${NDTelegram.MessageThreadId} not specified`);
            }
        }

    }

    public notify(monitoringRecord: MonitoringRecord) {
        let text = monitoringRecord.getDescription();
        if (text == null) {
            Logger.warn(`When sending to Telegram, description is null. Skipping message`);
            return ;
        }

        this.sendMessage(text);
    }

    private sendMessage(text: String) {
        const body = {
            chat_id: this._chatId,
            parse_mode: this._parseMode,
            message_thread_id: this._messageThreadId,
            text: text,
        }

        const url = `https://api.telegram.org/bot${this._botToken}/sendMessage`;

        axios.post(url, body, {}).then((response) => {
            Logger.info(`Got response: ${JSON.stringify(response)}`);
        }).catch(reason => {
            Logger.warn(`Got error calling request: Reason: ${JSON.stringify(reason)}`);
        });
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} ChatId: ${this._chatId}`);
        Logger.warn(`${deepness} ParseMode: ${this._parseMode}`);
        Logger.warn(`${deepness} MessageThreadID: ${this._messageThreadId}`);
    }
}