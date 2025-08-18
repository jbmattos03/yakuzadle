import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";

interface SessionRequest extends Request {
    session: Session & { 
        sessionId?: string;
        userId?: number;
        gameSessionId?: number;
    };
}

const sessionIdMiddleware = (req: SessionRequest, res: Response, next: NextFunction) => {
    if (!req.session.sessionId) {
        req.session.sessionId = crypto.randomUUID();
    }
    next();
};

export { SessionRequest, sessionIdMiddleware };