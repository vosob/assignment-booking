import { IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  businessId: string;

  @IsDateString()
  scheduledAt: string;

  @IsDateString()
  endAt: string;
}
