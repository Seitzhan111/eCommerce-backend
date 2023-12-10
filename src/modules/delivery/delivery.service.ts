import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from "./models/delivery.model";
import { CreateDeliveryDto } from "./dto";

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery) private deliveryModel: typeof Delivery,
  ) {}

  async createDelivery(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    try {
      const { orderId, userId, ...rest } = createDeliveryDto;
      return await this.deliveryModel.create({
        ...rest,
        orderId,
        userId,
      });
    } catch (error) {
      console.error(`Ошибка при создании доставки: ${error.message}`);
      throw new BadRequestException(error);
    }
  }

  async getDeliveryByOrderId(orderId: number): Promise<Delivery | null> {
    try {
      const existDelivery = this.deliveryModel.findOne({ where: { orderId } });
      if (!existDelivery) throw new BadRequestException('Доставка не существует')
      return existDelivery
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateDelivery(deliveryId: number, updatedData: CreateDeliveryDto): Promise<[number, Delivery[]]> {
    try {
      const [affectedCount, affectedRows] = await this.deliveryModel.update(updatedData, {
        where: { id: deliveryId },
        returning: true,
      });

      return [affectedCount, affectedRows as Delivery[]];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteDelivery(deliveryId: number): Promise<string | null> {
    try {
      const result = await this.deliveryModel.destroy({ where: { id: deliveryId } });
      if (result) {
        return "Доставка успешно удалена";
      } else {
        return "Доставка с указанным идентификатором не найдена";
      }
    } catch (error) {
      console.error(`Ошибка при удалении доставки: ${error.message}`);
      throw new BadRequestException(error);
    }
  }

  async getAllDeliveriesForUser(userId: number): Promise<Delivery[]> {
   try {
     const existDelivery = this.deliveryModel.findAll({ where: { userId } });
     return existDelivery
   }catch (error) {
     throw new BadRequestException(error);
   }
  }
}