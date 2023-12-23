import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CallRequest } from "./models/call-request.model";

@Injectable()
export class CallRequestService {
  constructor(
    @InjectModel(CallRequest)
    private readonly callRequestModel: typeof CallRequest,
  ) {}

  async createCallRequest(data: {
    name: string;
    phoneNumber: string;
    callbackTime?: Date;
    comment?: string;
  }): Promise<{message: string}> {
    try {
      await this.callRequestModel.create(data);
      return {message: 'Мы вам перезвоним!'}
    }catch (error) {
      throw new Error(error)
    }
  }

  async getAllCallRequests(): Promise<CallRequest[]> {
    return this.callRequestModel.findAll();
  }
}