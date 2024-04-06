import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppConfig } from '@app/modules/config';
import { GetAppConfig } from '@shared/docs';

@ApiTags('config')
@Controller({ path: 'config', version: '1' })
export class ConfigController {
  constructor(private readonly appConfig: AppConfig) {}

  @Get()
  @GetAppConfig()
  findOne() {
    const { app, health } = this.appConfig.props;
    return {
      app: {
        name: app.name,
        description: app.description,
        port: app.port,
        context_path: app.contextPath,
        upload_path: app.uploadPath,
        body_limit: app.bodyLimit,
      },
      health: {
        disk: health.diskThresholdPercent,
        memory: health.memoryThreshold,
      },
    };
  }
}
