import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

import { AppConfig } from '@app/modules/config';
import { ONE_MB } from '@shared/constants';

@ApiTags('health')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  private readonly PLATFORM_PATH = process.platform === 'win32' ? 'C:\\' : '/'; // FIXME: use external config
  private readonly DISK_THRESHOLD_PERCENT: number;
  private readonly MEMORY_THRESHOLD_IN_MB: number;

  constructor(
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly appConfig: AppConfig,
  ) {
    this.DISK_THRESHOLD_PERCENT = this.appConfig.props.health.diskThresholdPercent;
    this.MEMORY_THRESHOLD_IN_MB = this.appConfig.props.health.memoryThreshold * ONE_MB;
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // The used disk storage should not exceed 75% of the full disk size.
      () =>
        this.disk.checkStorage('disk_storage', {
          thresholdPercent: this.DISK_THRESHOLD_PERCENT,
          path: this.PLATFORM_PATH,
        }),

      // The used memory heap and RSS/RAM should not exceed this threshold.
      () => this.memory.checkHeap('memory_heap', this.MEMORY_THRESHOLD_IN_MB),
      () => this.memory.checkRSS('memory_rss', this.MEMORY_THRESHOLD_IN_MB),
    ]);
  }
}
