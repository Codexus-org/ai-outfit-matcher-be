import { Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponseHandler = (res: Response, status: number, message: string, error: Error | null, data: unknown, cookies?: any[]) => {
    if (cookies) {
        cookies.forEach((cookie) => {
          res.cookie(cookie.name, cookie.value, cookie.options);
        });
    }
    return res.status(status).json({ status, success: status !== 200 ? false : true, message, error, data });
}
export default ResponseHandler;