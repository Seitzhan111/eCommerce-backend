import { Controller, Post, Body, Get } from '@nestjs/common';
import { CallRequestService } from './call-request.service';

@Controller('call-requests')
export class CallRequestController {
  constructor(private readonly callRequestService: CallRequestService) {}

  @Post()
  async createCallRequest(
    @Body() body: {
      name: string;
      phoneNumber: string;
      callbackTime?: Date;
      comment?: string;
    },
  ) {
    return this.callRequestService.createCallRequest(body);
  }

  @Get()
  async getAllCallRequests() {
    return this.callRequestService.getAllCallRequests();
  }
}