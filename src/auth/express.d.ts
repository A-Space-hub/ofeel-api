declare global {
  namespace Express {
    interface User {
      id: string;
      role: 'USER' | 'ADMIN';
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
