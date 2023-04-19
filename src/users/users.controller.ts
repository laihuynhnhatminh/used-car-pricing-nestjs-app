import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import {
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common/decorators';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/me')
  public findCurrentUser(@CurrentUser() user: User): User {
    return user;
  }

  @Post('/signup')
  public async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  public async signin(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  public signOut(@Session() session: any): void {
    session.userId = null;
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  public async findById(@Param('id') id: string): Promise<User> {
    const [user] = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get()
  public async findByEmail(@Query('email') email: string): Promise<User> {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch('/:id')
  public update(
    @Body() body: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  public async delele(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(parseInt(id));
    return { message: 'User deleted' };
  }
}
