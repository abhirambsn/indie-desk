import { Module } from '@nestjs/common';
import { LoggerModule } from '@iedesk/core';
import { TrpcModule } from './trpc/trpc.module';

@Module({
  imports: [LoggerModule.forRoot(), TrpcModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
