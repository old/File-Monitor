"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const checksum = require("checksum");
class FileMonitor {
    // configValidator validates the config.json data, if any fields are invalid an error will be thrown
    static validateConfig(config, proxies) {
        switch (true) {
            case config.mongoConnectionURL.trim() === "":
                throw new Error("Mongo Atlas connection URL is invalid");
            case config.discordWebhookURL.trim() === "":
                throw new Error("Discord webhook URL is invalid");
            case config.monitorDelay < 30000:
                throw new Error("Monitor delay cannot be under 30 seconds to avoid endpoint rate limiting");
            case config.useProxies && proxies.length === 0:
                throw new Error("No proxies inputted in proxies.txt, add proxies to the proxies.txt, or set config.useProxies to false if you do not want to use proxies for monitoring");
            case config.monitorTheseEndpoints.length === 0:
                throw new Error("monitorTheseEndpoints is empty, add endpoints to the array that you want to monitor");
            case config.monitorAkamai && config.monitorTheseAkamaiEndpoints.length < 0:
                throw new Error("monitorTheseAkamaiEndpoints is empty, set config.monitorAkamai to false if you do not want to monitor akamai endpoints");
        }
    }
    static sendWebhook(fileData, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                embeds: [
                    {
                        thumbnail: {
                            url: fileData.siteImageURL,
                        },
                        color: "3066993",
                        title: "File has been changed!",
                        fields: [
                            {
                                name: "Site",
                                value: fileData.site,
                            },
                            {
                                name: "File Version",
                                value: fileData.fileChecksumHash,
                            },
                            {
                                name: "File Checksum",
                                value: fileData.fileChecksumHash,
                            },
                            {
                                name: "Date Found",
                                value: fileData.fileChangeTime,
                            },
                        ],
                        footer: {
                            text: fileData.site,
                            icon_url: fileData.siteImageURL,
                        },
                    },
                ],
                content: "",
            };
            const response = yield axios_1.default.post(config.discordWebhookURL, JSON.stringify(body), {
                headers: {
                    "content-type": "multipart/form-data",
                },
            });
        });
    }
    static sendErrorWebhook(config) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // monitor loop through all the endpoints every x millaseconds
    static monitor(config, proxies) {
        return __awaiter(this, void 0, void 0, function* () {
            const { monitorTheseEndpoints, monitorAkamai, monitorTheseAkamaiEndpoints, monitorDelay } = config;
            //setInterval(() => {
            try {
                console.log("fdsfd");
                monitorTheseEndpoints.forEach((endpoint) => __awaiter(this, void 0, void 0, function* () {
                    const { data } = yield axios_1.default.get(endpoint);
                    const fileData = {
                        site: endpoint,
                        siteURL: endpoint,
                        siteImageURL: "",
                        fileContents: data,
                        fileChecksumHash: checksum(data),
                        fileChangeTime: (0, utils_1.fullDate)(),
                    };
                    FileMonitor.sendWebhook(fileData, config);
                }));
                if (monitorAkamai) {
                }
            }
            catch (err) {
                console.log("FDSFDSFsFSDFSD");
                FileMonitor.sendErrorWebhook(config);
            }
            //	}, monitorDelay);
        });
    }
    static Start(config, proxies) {
        return __awaiter(this, void 0, void 0, function* () {
            FileMonitor.validateConfig(config, proxies); // validates the config.json values
            FileMonitor.monitor(config, proxies); // starts the monitor
        });
    }
}
exports.default = FileMonitor;
