import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HealthModule } from '@app/modules/health/health.module';
import { RulesModule } from '@app/modules/rules/rules.module';

@Module({ imports: [HealthModule, HttpModule, RulesModule] })
export class AppModule {}
