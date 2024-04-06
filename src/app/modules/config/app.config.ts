import { Logger } from '@nestjs/common';
import { readFileSync as read, existsSync, mkdirSync } from 'fs';
import * as yaml from 'js-yaml';

const configPath: string = process.env['JT_CONFIG_PATH'] ?? 'config/default.yml';

interface Config {
  app: {
    name: string;
    description: string;
    version: string;
    port: number;
    contextPath: string;
    uploadPath: string;
    bodyLimit: string | number;
  };
  health: {
    diskThresholdPercent: number;
    memoryThreshold: number;
  };
}

class AppConfig {
  private static _instance: AppConfig;
  private readonly _config: Config;
  private readonly logger = new Logger(AppConfig.name);

  get props(): Config {
    return this._config;
  }

  private constructor() {
    if (!existsSync(configPath)) {
      this.logger.warn(`Config file not found at ${configPath}`);
      this._config = DEFAULT_CONFIG;
      return;
    }
    this.logger.log(`Loading config from ${configPath}`);

    const config = yaml.load(read(configPath, 'utf-8')) as Record<string, any>;
    const service = config?.service;
    const performance = config?.performance;
    const indicators = performance?.health?.indicators;
    this._config = {
      app: {
        name: config?.name ?? DEFAULT_CONFIG.app.name,
        description: config?.description ?? DEFAULT_CONFIG.app.description,
        version: DEFAULT_CONFIG.app.version,
        port: parseInt(service?.port ?? DEFAULT_CONFIG.app.port, 10),
        contextPath: service?.contextPath ?? DEFAULT_CONFIG.app.contextPath,
        uploadPath: service?.uploadPath ?? DEFAULT_CONFIG.app.uploadPath,
        bodyLimit: service?.bodyLimit ?? DEFAULT_CONFIG.app.bodyLimit,
      },
      health: {
        diskThresholdPercent: parseFloat(indicators?.disk ?? DEFAULT_CONFIG.health.diskThresholdPercent),
        memoryThreshold: parseInt(indicators?.memory ?? DEFAULT_CONFIG.health.memoryThreshold, 10),
      },
    };

    if (!existsSync(this._config.app.uploadPath)) mkdirSync(this._config.app.uploadPath, { recursive: true });
  }

  static getInstance(): AppConfig {
    return this._instance ?? (this._instance = new AppConfig());
  }

  printUsage(verbose = false): void {
    const { app } = this._config;
    const description = app.description ? `(${app.description})` : '';
    Logger.log(`${app.name} ${description} running on port ${app.port}...`, 'API');
    if (verbose) this.printVerbose();
  }

  printVerbose(): void {
    this.logger.log(`Printing app config: \n${JSON.stringify(this._config, null, 2)}`);
  }
}

const DEFAULT_CONFIG: Config = {
  app: {
    name: 'xtransformer',
    description: 'JSON transformation',
    version: '1.0',
    port: 8080,
    contextPath: '/',
    uploadPath: 'uploads',
    bodyLimit: '50mb',
  },
  health: {
    diskThresholdPercent: 0.75, // 75%
    memoryThreshold: 1024, // 1GB
  },
} as const;

/**
 * Loads the configuration from the environment variables.
 * @returns {Config} the app config
 */
const loadConfig = (): Config => AppConfig.getInstance().props;

export { AppConfig, Config, loadConfig, DEFAULT_CONFIG, configPath as CONFIG_PATH };
