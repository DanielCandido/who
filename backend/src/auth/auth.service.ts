import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserRepository } from 'src/modules/repositories';
import { compare } from 'bcrypt';
import { RefreshTokenRepository } from 'src/modules/repositories/refresh-token.respository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  isValidMail(email: string) {
    if (email.includes('@')) {
      return true;
    }

    return false;
  }

  generateToken(userId: string) {
    const JWT_KEY = '7u598cj1m753128947y2893n1d98asudyas';

    const token = sign({}, JWT_KEY, {
      subject: userId,
      expiresIn: '1h',
    });

    return token;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findUserByUnique({ email: email });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('password incorrect');
    }

    const token = this.generateToken(user.id);
    const refreshToken = await this.refreshTokenRepository.create(user.id);

    return { token, refreshToken };
  }
}
