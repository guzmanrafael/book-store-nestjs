import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('userId must be sent');
    }

    const book: Book = await this._bookRepository.findOne(bookId, {
      where: { status: 'ACTIVE' },
    });

    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: 'ACTIVE' },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('id must be sent');
    }

    const books: Book[] = await this._bookRepository.find({
      where: { status: 'ACTIVE', authors: In([authorId]) },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { status: 'ACTIVE' },
      });

      if (!authorExists) {
        throw new NotFoundException(
          `There's not an author with this Id: ${authorId}`,
        );
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new ConflictException(`This user ${authorId} is not an author`);
      }

      authors.push(authorExists);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async createByAuthor(book: Partial<CreateBookDto>, authorId: number) {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: 'INACTIVE' },
    });

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.ADMIN,
    );

    if (!isAuthor) {
      throw new ConflictException(`This user ${authorId} is not an author`);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
  ): Promise<ReadBookDto> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: 'ACTIVE' },
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exists');
    }

    bookExists.name = book.name;
    bookExists.description = book.description;

    const updatedBook: Book = await this._bookRepository.save(bookExists);
    return plainToClass(ReadBookDto, updatedBook);
  }

  async delete(id: number): Promise<void> {
    const bookExists = await this._bookRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exists');
    }

    await this._bookRepository.update(id, { status: 'INACTIVE' });
  }
}
