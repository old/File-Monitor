import fs from "fs";
import path from "path";
import { Config } from "./config";
import FileMonitor from "./monitor";

(async () => {
	try {
		const configFile = String(fs.readFileSync(path.join(__dirname, "..", "config.json")));
		const proxiesFile = String(fs.readFileSync(path.join(__dirname, "..", "proxies.txt")));

		const config: Config = JSON.parse(configFile);
		const proxies: string[] = proxiesFile.replace(/\r\n/g, "\n").split("\n"); // adds each line of the txt file into a array

		FileMonitor.Start(config, proxies);
	} catch (err) {
		console.log(err);
	}
})();
