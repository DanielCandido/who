import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const validMail = 'email@email.com';
  const validPassword = '123321';

  const requestMock = {} as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(() => 'validToken'),
            isValidMail: jest.fn((email: string) => email.includes('@')),
            login: jest.fn(
              (email: string, password: string) =>
                email === validMail && password === validPassword,
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a status 403, invalid email format', () => {
      try {
        controller.login(requestMock, {
          email: 'invalidemailformat',
          password: 'anypassword',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return a status 401 - invalid email', () => {
      try {
        controller.login(requestMock, {
          email: 'invalid@email.com',
          password: '123321',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return a status 401 - invalid password', () => {
      try {
        controller.login(requestMock, {
          email: 'email@email.com',
          password: '1234',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return a status 200 - login correct', async () => {
      const response = await controller.login(requestMock, {
        email: 'email@email.com',
        password: '123321',
      });

      expect(response.token).toEqual('validToken');
      expect(response.refreshToken).toEqual('refreshtoken');
      expect(response.expireAt).toEqual('2d');
    });
  });
});
