declare global {
  interface AuthUser {
    id: number;
    email: string;
  }

  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
