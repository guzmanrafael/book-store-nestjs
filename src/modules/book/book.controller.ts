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
import { GetUser } from '../auth/user.decorator';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @Get(':id')
  getRole(@Param('id', ParseIntPipe) id: number): Promise<ReadBookDto> {
    return this._bookService.get(id);
  }

  @Get()
  getRoles(): Promise<ReadBookDto[]> {
    return this._bookService.getAll();
  }

  @Post()
  createRole(@Body() role: Partial<CreateBookDto>): Promise<ReadBookDto> {
    return this._bookService.create(role);
  }

  @Post()
  createRoleByAuthor(
    @Body() role: Partial<CreateBookDto>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.createByAuthor(role, authorId);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Partial<UpdateBookDto>,
  ) {
    return this._bookService.update(id, role);
  }

  @Delete(':id')
  deleteRole(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this._bookService.delete(id);
  }
}
