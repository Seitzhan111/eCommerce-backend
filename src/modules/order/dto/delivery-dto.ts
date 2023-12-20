import { IsNotEmpty } from 'class-validator';

export class CreateDeliveryDto {
  @IsNotEmpty()
  deliveryAddress: string;

  @IsNotEmpty()
  recipientFullName: string;

  @IsNotEmpty()
  recipientPhoneNumber: string;

  @IsNotEmpty()
  paymentMethod: string;
}