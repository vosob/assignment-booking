import { IsDateString } from 'class-validator';

export class EditBookingDto {
  @IsDateString()
  scheduledAt: string;

  @IsDateString()
  endAt: string;
}
