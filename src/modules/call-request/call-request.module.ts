import { Module } from '@nestjs/common';
import { CallRequestService } from './call-request.service';
import { CallRequestController } from './call-request.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { CallRequest } from "./models/call-request.model";

@Module({
  imports: [SequelizeModule.forFeature([CallRequest])],
  providers: [CallRequestService],
  controllers: [CallRequestController]
})
export class CallRequestModule {}
