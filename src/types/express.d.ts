import "express";

declare global {
  namespace Express {
    interface Request {
      admin: {
        admin_id: number;
        store_id: number;
      };
    }
  }
}

export {};
