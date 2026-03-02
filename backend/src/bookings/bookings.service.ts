import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(
    clientId: string,
    dto: CreateBookingDto,
  ): Promise<Booking> {
    const { businessId, scheduledAt, endAt } = dto;

    const newStart = new Date(scheduledAt);
    const newEnd = new Date(endAt);

    const business = await this.prismaService.user.findUnique({
      where: { id: businessId },
    });

    if (!business || business.role !== 'BUSINESS') {
      throw new NotFoundException('Business not found');
    }

    const conflict = await this.prismaService.booking.findFirst({
      where: {
        businessId,
        AND: [{ scheduledAt: { lt: newEnd } }, { endAt: { gt: newStart } }],
      },
    });

    if (conflict) {
      throw new ConflictException('Time slot is already taken');
    }
    return this.prismaService.booking.create({
      data: {
        clientId,
        businessId,
        scheduledAt: newStart,
        endAt: newEnd,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        business: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getMyBookings(clientId: string) {
    return await this.prismaService.booking.findMany({
      where: { clientId },
      include: {
        business: { select: { id: true, name: true, email: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getAvailableSlots(businessId: string, date: string) {
    const business = await this.prismaService.user.findUnique({
      where: { id: businessId },
    });

    if (!business || business.role !== 'BUSINESS') {
      throw new NotFoundException('Business not found');
    }

    const dayStart = new Date(`${date}T07:00:00.000Z`);
    const dayEnd = new Date(`${date}T16:00:00.000Z`);
    const slotDuration = 60;

    const allSlots: { scheduledAt: Date; endAt: Date }[] = [];
    let cursor = new Date(dayStart);

    while (cursor < dayEnd) {
      const slotEnd = new Date(cursor.getTime() + slotDuration * 60_000);
      allSlots.push({ scheduledAt: new Date(cursor), endAt: slotEnd });
      cursor = slotEnd;
    }

    const booked = await this.prismaService.booking.findMany({
      where: {
        businessId,
        scheduledAt: { gte: dayStart, lt: dayEnd },
      },
      select: { scheduledAt: true, endAt: true },
    });

    return allSlots.filter(
      (slot) =>
        !booked.some(
          (b) => slot.scheduledAt < b.endAt && slot.endAt > b.scheduledAt,
        ),
    );
  }

  async deleteBooking(clientId: string, bookingId: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientId !== clientId) {
      throw new ConflictException('You can only delete your own bookings');
    }

    return await this.prismaService.booking.delete({
      where: { id: bookingId },
    });
  }
}
