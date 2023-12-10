import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from "@nestjs/common";
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { CreateDeliveryDto } from "./dto";
import { Delivery } from "./models/delivery.model";

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto): Promise<{ message: string; error?: string; delivery?: Delivery }> {
    try {
      const createdDelivery = await this.deliveryService.createDelivery(createDeliveryDto);
      return { message: 'Доставка успешно создана', delivery: createdDelivery };
    } catch (error) {
      return { message: 'Ошибка при создании доставки', error: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getDeliveryByOrderId(@Param('orderId') orderId: number) {
    const delivery = await this.deliveryService.getDeliveryByOrderId(orderId);
    if (delivery) {
      return { success: true, data: delivery };
    } else {
      return { success: false, message: 'Доставка не найдена для данного идентификатора заказа.' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateDelivery(@Param('id') deliveryId: number, @Body() updatedData: CreateDeliveryDto) {
    const [affectedCount, affectedRows] = await this.deliveryService.updateDelivery(deliveryId, updatedData);

    if (affectedCount > 0) {
      return { success: true, data: affectedRows };
    } else {
      return { success: false, message: 'Доставка не найдена или не обновлена.' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDelivery(@Param('id') deliveryId: number) {
    const affectedRows = await this.deliveryService.deleteDelivery(deliveryId);
    return affectedRows
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getAllDeliveriesForUser(@Param('userId') userId: number) {
    const deliveries = await this.deliveryService.getAllDeliveriesForUser(userId);
    return { success: true, data: deliveries };
  }
}