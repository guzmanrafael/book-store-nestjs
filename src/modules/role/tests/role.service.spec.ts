import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role.entity';
import { RoleService } from '../role.service';

const rolesArray = [
  new Role('Role test 1', 'role description 1'),
  new Role('Role test 2', 'role description 2'),
  new Role('Role test 3', 'role description 3'),
];

const oneRole = new Role('Test Role', 'Description');

describe('Role Service', () => {
  let service: RoleService;
  let repo: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            find: jest.fn().mockResolvedValue(rolesArray),
            findOne: jest.fn().mockResolvedValue(oneRole),
            delete: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repo = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All roles', () => {
    it('should return an arrray of roles', async () => {
      const roles = await service.getAll();
      expect(roles).toEqual(rolesArray);
    });
  });

  describe('Get One role', () => {
    it('should get a single role', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      expect(service.get(1)).resolves.toEqual(oneRole);
      expect(repoSpy).toBeCalledWith(1, {
        where: { status: 'ACTIVE' },
      });
    });
  });
});
