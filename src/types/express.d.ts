import "express";

declare global {
  namespace Express {
    interface Request {
      admin: {
        admin_id: string;
        store_id: string;
      };
    }
  }
}

export {};
