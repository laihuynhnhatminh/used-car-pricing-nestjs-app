import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { Delete, Get, Param, Patch, Query } from '@nestjs/common/decorators';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Post('/signup')
  public createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  public signin(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signin(body.email, body.password);
  }

  @Get('/:id')
  public async findUser(@Param('id') id: string): Promise<User[]> {
    const user = this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get()
  public findAllUsers(@Query('email') email: string): Promise<User[]> {
    const user = this.usersService.find(email);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch('/:id')
  public find(
    @Body() body: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  public delele(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }
}
