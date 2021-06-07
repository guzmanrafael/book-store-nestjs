import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ReadUserDetailsDto } from './read-user-details.dto';
import { Type } from 'class-transformer';
import { Exclude, Expose } from 'class-transformer';
import { ReadRoleDto } from 'src/modules/role/dtos';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsString()
  readonly username: string;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @Type((type) => ReadUserDetailsDto)
  readonly details: ReadUserDetailsDto;

  @Expose()
  @Type((type) => ReadRoleDto)
  readonly roles: ReadRoleDto;
}
