import axios from "axios";
import { fullDate } from "./utils";
import { Config } from "./config";
const checksum = require("checksum");

export interface SiteData {
	site: string;
	siteURL: string;
	siteImageURL: string;
}

export interface FileData extends SiteData {
	fileContents: string;
	fileChecksumHash: string;
	fileChangeTime: string;
}

export default class FileMonitor {
	// configValidator validates the config.json data, if any fields are invalid an error will be thrown
	private static validateConfig(config: Config, proxies: string[]) {
		switch (true) {
			case config.mongoConnectionURL.trim() === "":
				throw new Error("Mongo Atlas connection URL is invalid");

			case config.discordWebhookURL.trim() === "":
				throw new Error("Discord webhook URL is invalid");

			case config.monitorDelay < 30000:
				throw new Error("Monitor delay cannot be under 30 seconds to avoid endpoint rate limiting");

			case config.useProxies && proxies.length === 0:
				throw new Error(
					"No proxies inputted in proxies.txt, add proxies to the proxies.txt, or set config.useProxies to false if you do not want to use proxies for monitoring"
				);
			case config.monitorTheseEndpoints.length === 0:
				throw new Error("monitorTheseEndpoints is empty, add endpoints to the array that you want to monitor");

			case config.monitorAkamai && config.monitorTheseAkamaiEndpoints.length < 0:
				throw new Error(
					"monitorTheseAkamaiEndpoints is empty, set config.monitorAkamai to false if you do not want to monitor akamai endpoints"
				);
		}
	}

	private static async sendWebhook(fileData: FileData, config: Config) {
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

		const response = await axios.post(config.discordWebhookURL, JSON.stringify(body), {
			headers: {
				"content-type": "multipart/form-data",
			},
		});
	}

	private static async sendErrorWebhook(config: Config) {}

	// monitor loop through all the endpoints every x millaseconds
	private static async monitor(config: Config, proxies: string[]) {
		const { monitorTheseEndpoints, monitorAkamai, monitorTheseAkamaiEndpoints, monitorDelay } = config;

		setInterval(() => {
			try {
				monitorTheseEndpoints.forEach(async (endpoint) => {
					const { data } = await axios.get(endpoint);

					const fileData: FileData = {
						site: endpoint,
						siteURL: endpoint,
						siteImageURL: "",
						fileContents: data,
						fileChecksumHash: checksum(data),
						fileChangeTime: fullDate(),
					};
					FileMonitor.sendWebhook(fileData, config);
				});

				if (monitorAkamai) {
				}
			} catch (err) {
				FileMonitor.sendErrorWebhook(config);
			}
		}, monitorDelay);
	}

	public static async Start(config: Config, proxies: string[]) {
		FileMonitor.validateConfig(config, proxies); // validates the config.json values
		FileMonitor.monitor(config, proxies); // starts the monitor
	}
}
