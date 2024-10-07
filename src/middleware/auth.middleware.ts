import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../models/auth.schema';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (accessToken) {
        try {
            jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);
        } catch (error) {
            if (!refreshToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);

                const activateRefreshToken = await Auth.findOne({ refreshToken });

                if (!activateRefreshToken) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                const payload = jwt.decode(refreshToken) as { id: string; name: string; email: string };

                const newAccessToken = jwt.sign({ id: payload.id, name: payload.name, email: payload.email }, process.env.JWT_ACCESS_SECRET as string, {
                    expiresIn: 300,
                });

                return res.cookie('accessToken', newAccessToken, { httpOnly: true }).status(200).json({ message: 'User logged in' });
            } catch (error) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
    }
    next();
};

export default authMiddleware;
