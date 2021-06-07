import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInDto, SignInDto, SignUpDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  SignUp(@Body() signupDto: SignUpDto): Promise<void> {
    return this._authService.signUp(signupDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  SignIn(@Body() signinDto: SignInDto): Promise<LoggedInDto> {
    return this._authService.signIn(signinDto);
  }
}
