import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { BookingsService } from './bookings.service';
import { GetSlotsDto } from './dto/get-slots.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Authorization()
  @Post()
  @HttpCode(201)
  createBooking(@Body() dto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingsService.createBooking(user.id, dto);
  }

  @Authorization()
  @Get('my-bookings')
  @HttpCode(200)
  async getMyBookings(@CurrentUser() user: User) {
    return await this.bookingsService.getMyBookings(user.id);
  }

  @Get(':id/slots')
  @Authorization()
  getAvailableSlots(
    @Param('id') businessId: string,
    @Query() { date }: GetSlotsDto,
  ) {
    return this.bookingsService.getAvailableSlots(businessId, date);
  }

  @Delete(':id')
  @Authorization()
  deleteBooking(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.bookingsService.deleteBooking(user.id, id);
  }
}
