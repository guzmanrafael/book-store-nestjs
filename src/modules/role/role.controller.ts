import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':roleId')
  getRole(@Param('roleId', ParseIntPipe) roleId: number): Promise<ReadRoleDto> {
    const role = this._roleService.get(roleId);
    return role;
  }

  @Get()
  getRoles(): Promise<ReadRoleDto[]> {
    const roles = this._roleService.getAll();
    return roles;
  }

  @Post()
  createRole(@Body() role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    const createdRole = this._roleService.create(role);
    return createdRole;
  }

  @Patch(':roleId')
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    const updatedRole = await this._roleService.update(roleId, role);
    return updatedRole;
  }

  @Delete(':roleId')
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    await this._roleService.delete(roleId);
    return true;
  }
}
