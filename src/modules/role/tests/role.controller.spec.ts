import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { RoleController } from '../role.controller';
import { RoleService } from '../role.service';

const testRole = {
  name: 'GENERAL',
  description: 'General description',
};

describe('Role Controller', () => {
  let controller: RoleController;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              {
                name: testRole.name,
                description: testRole.description,
              },
              {
                name: 'ADMIN',
                description: 'Admin description',
              },
            ]),
            get: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                name: testRole.name,
                description: testRole.description,
                id,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((role: CreateRoleDto) =>
                Promise.resolve({ id: 1, ...role }),
              ),
            update: jest
              .fn()
              .mockImplementation((id, role: UpdateRoleDto) =>
                Promise.resolve({ id, ...role }),
              ),
            delete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetRoles', () => {
    it('should get an array of roles', async () => {
      await expect(controller.getRoles()).resolves.toEqual([
        {
          name: testRole.name,
          description: testRole.description,
        },
        {
          name: 'ADMIN',
          description: 'Admin description',
        },
      ]);
    });
  });

  describe('Get role by id', () => {
    it('should get a single role', async () => {
      await expect(controller.getRole(1)).resolves.toEqual({
        name: testRole.name,
        description: testRole.description,
        id: 1,
      });
      await expect(controller.getRole(2)).resolves.toEqual({
        name: testRole.name,
        description: testRole.description,
        id: 2,
      });
    });
  });

  describe('Create new role', () => {
    it('should create a new role', async () => {
      const newRoleDto: CreateRoleDto = {
        name: 'New Role 1',
        description: 'New Role 1 description',
      };
      await expect(controller.createRole(newRoleDto)).resolves.toEqual({
        id: 1,
        ...newRoleDto,
      });
    });
  });

  describe('Update role by id', () => {
    it('should update a role', async () => {
      const updatedRole: UpdateRoleDto = {
        name: 'Role updated',
        description: 'Role description updated',
      };
      await expect(controller.updateRole(1, updatedRole)).resolves.toEqual({
        id: 1,
        ...updatedRole,
      });
    });
  });

  describe('Delete role by id', () => {
    it('should return that it deleted a role', async () => {
      await expect(controller.deleteRole(1)).resolves.toEqual(true);
    });
  });
});
