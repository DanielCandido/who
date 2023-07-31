import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/repositories';
import { compare } from 'bcrypt';
import { RefreshTokenRepository } from 'src/modules/repositories/refresh-token.respository';
import { JwtService } from '@nestjs/jwt/dist';

interface Payload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  isValidMail(email: string) {
    if (email.includes('@')) {
      return true;
    }

    return false;
  }

  generateToken(userId: string) {
    const token = this.jwtService.sign({ userId });

    return token;
  }

  decodeToken(token: string) {
    const payload = this.jwtService.decode(token) as Payload;

    return payload;
  }

  async signIn(email: string, password: string) {
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

    return { token, refreshToken, user };
  }

  getAuthenticatedUser(req: Request) {
    const [, token] = req.headers['authorization']?.split(' ') ?? [];

    const payload = this.decodeToken(token);

    if (!payload.userId) {
      throw new BadRequestException('missing param error: userId');
    }

    return payload.userId;
  }
}
