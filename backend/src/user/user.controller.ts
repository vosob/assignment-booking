import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto/editUser.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('all')
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Authorization()
  @Get('business')
  getBusinessUser() {
    return this.userService.getBusinessUser();
  }

  @Patch('edit/:id')
  editUser(@Param('id') id: string, @Body() data: EditUserDto) {
    return this.userService.editUser(id, data);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
