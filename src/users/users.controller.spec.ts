import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service";

describe('UsersController', () => {
    let usersController: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;
    let fakeUsersList: User[];
    let id = 1;
    beforeEach(async () => {
        fakeUsersList = [];
        fakeUsersService = {
            create: (email: string, password: string) => {
                const user = {
                    id,
                    email,
                    password,
                } as User
                id += 1;
                fakeUsersList.push(user);
                return Promise.resolve(user);
            },
            find: (email: string) => {
              const filteredUsers: User[] = fakeUsersList.filter(user => user.email === email);
              return Promise.resolve(filteredUsers);
            },
            findOne: (id: number) => {
                const filteredUsers: User[] = fakeUsersList.filter(user => user.id === id);
                return Promise.resolve(filteredUsers);
            },
            update: (id: number, attrs: Partial<User>) => {
                const [ filteredUser ]  = fakeUsersList.filter(user => user.id === id);
                const filteredUserIndex = fakeUsersList.indexOf(filteredUser);
                Object.assign(filteredUser, attrs);
                fakeUsersList[filteredUserIndex] = filteredUser;
                return Promise.resolve(filteredUser);
            },
            remove: (id: number) => {
                fakeUsersList.filter(user => user.id !== id);
                return Promise.resolve();
            }
          };
        
          fakeAuthService = {

          }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                }
            ]
        }).compile();

        usersController = module.get<UsersController>(UsersController);

        fakeUsersService.create('fake@fake.com', 'password');
        fakeUsersService.create('real@real.com', 'password');
        id = 1;
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
    });

    it('use findByEmail - should return a user with that email', async () => {
        const user = await usersController.findByEmail('real@real.com');
        expect(user).toBeDefined();
    });

    it('use findByEmail - should throw an error if no such email exist', async () => {
        fakeUsersService.find = () => Promise.resolve([]);
        await expect(usersController.findByEmail('fake@real.com')).rejects.toThrow(NotFoundException);
    });

    it('use findById - should return a user of the provided id', async () => {
        const user = await usersController.findById('1');
        expect(user).toBeDefined();
    });

    it('use findById - should throw an error if provided id is wrong', async () => {
        fakeUsersService.findOne = () => Promise.resolve([]);
        await expect(usersController.findById('1')).rejects.toThrow(NotFoundException);
    });
})