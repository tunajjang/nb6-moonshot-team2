import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { is } from 'superstruct';

import { AuthService } from '@services';
import { signUpStruct, loginStruct } from '@superstructs';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 회원가입
   */
  public signUp = async (req: Request, res: Response) => {
    if (!is(req.body, signUpStruct)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input data.' });
    }

    const newUser = await this.authService.signUp(req.body as Prisma.UserCreateInput);
    return res.status(StatusCodes.CREATED).json(newUser);
  };

  /**
   * 로그인
   */
  public login = async (req: Request, res: Response) => {
    if (!is(req.body, loginStruct)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input data.' });
    }
    const { email, password } = req.body as Prisma.UserCreateInput;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';

    const result = await this.authService.login(email, password, userAgent); //email, password
    return res.status(StatusCodes.OK).json(result);
  };
}
