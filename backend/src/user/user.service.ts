import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/editUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUser() {
    const res = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    return res;
  }

  async getBusinessUser() {
    const res = await this.prismaService.user.findMany({
      where: { role: 'BUSINESS' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    return res;
  }

  async editUser(id: string, dto: EditUserDto) {
    const { name, email, role } = dto;

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { name, email, role },
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    // видаляємо всі бронювання де користувач є клієнтом
    await this.prismaService.booking.deleteMany({
      where: { clientId: id },
    });

    // видаляємо всі бронювання де користувач є бізнесом
    await this.prismaService.booking.deleteMany({
      where: { businessId: id },
    });

    // тепер можна видалити користувача
    const deletedUser = await this.prismaService.user.delete({
      where: { id },
    });

    return deletedUser;
  }
}
