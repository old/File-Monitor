export type Config = {
	mongoConnectionURL: string;
	discordWebhookURL: string;
	pingOnUpdate: boolean;
	webhookOnError: boolean;
	useProxies: boolean;
	monitorAkamai: boolean;
	monitorDelay: number;
	monitorTheseEndpoints: string[];
	monitorTheseAkamaiEndpoints: string[];
};
