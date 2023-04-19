import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const fakeUsersList: User[] = []
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers: User[] = fakeUsersList.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
            id: Math.floor(Math.random() * 999999),
            email,
            password,
        } as User
        fakeUsersList.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('use signUp - should create a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'password');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('password');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('use signUp - should throw an error if email already exists', async () => {
    await service.signup('fake@fake.com', 'password');
    await expect(service.signup('fake@fake.com', 'password')).rejects.toThrow(BadRequestException);
  });

  it('use signIn - should throw an error if no such user exist', async () => {
    await expect(service.signin('fake@fake.com', 'password123')).rejects.toThrow(NotFoundException);
  });

  it('use signIn - should throw an error if password is not valid', async () => {
    await service.signup('fake@fake.com', 'password');
    await expect(service.signin('fake@fake.com', 'password123')).rejects.toThrow(BadRequestException);
  });

  it('use signIn - should return the correct user upon successful login', async () => {
    await service.signup('real@real.com', 'password');
    const user = await service.signin('real@real.com', 'password');
    expect(user).toBeDefined();
  });
});
