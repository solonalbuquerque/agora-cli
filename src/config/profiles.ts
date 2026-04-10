import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {ConfigFile, Profile} from "./schema";

const CONFIG_DIR = path.join(os.homedir(), ".agora-cli");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

function defaultConfig(): ConfigFile {
  return {
    activeProfile: "default",
    profiles: {
      default: {
        name: "default",
        baseUrl: "http://localhost:3000",
        authType: "apiKey"
      }
    }
  };
}

export function configPath(): string {
  return CONFIG_PATH;
}

export function readConfigFile(): ConfigFile {
  if (!fs.existsSync(CONFIG_PATH)) {
    return defaultConfig();
  }

  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw) as ConfigFile;
}

export function writeConfigFile(config: ConfigFile): void {
  fs.mkdirSync(CONFIG_DIR, {recursive: true});
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function setProfile(name: string, profilePatch: Partial<Profile>): Profile {
  const cfg = readConfigFile();
  const current = cfg.profiles[name] || {name, baseUrl: "http://localhost:3000", authType: "apiKey" as const};
  const next = {...current, ...profilePatch, name};
  cfg.profiles[name] = next;
  writeConfigFile(cfg);
  return next;
}

export function setActiveProfile(name: string): void {
  const cfg = readConfigFile();
  if (!cfg.profiles[name]) {
    throw new Error(`Profile not found: ${name}`);
  }

  cfg.activeProfile = name;
  writeConfigFile(cfg);
}

export function clearProfileCredentials(name: string): void {
  const cfg = readConfigFile();
  if (!cfg.profiles[name]) return;

  const p = cfg.profiles[name];
  cfg.profiles[name] = {
    ...p,
    token: undefined,
    apiKey: undefined,
    agentSecret: undefined
  };

  writeConfigFile(cfg);
}