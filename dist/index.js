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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const monitor_1 = __importDefault(require("./monitor"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const configFile = String(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "config.json")));
        const proxiesFile = String(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "proxies.txt")));
        const config = JSON.parse(configFile);
        const proxies = proxiesFile.replace(/\r\n/g, "\n").split("\n"); // adds each line of the txt file into a array
        monitor_1.default.Start(config, proxies);
    }
    catch (err) {
        console.log(err);
    }
}))();
