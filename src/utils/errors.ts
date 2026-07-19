import type { Response } from "express";

const renderError = (res: Response, status: number, message: string) => {
  return res.status(status).render("error", { status, message });
};

export { renderError };
