const jwt = require("jsonwebtoken");
import type { Request, Response, NextFunction } from "express";
import { messages } from "../config";
import dotenv from "dotenv";

dotenv.config();

// Define interfaces for token data and verification response
export interface TokenData {
	id: string;
	fullName: string;
	status: string;
	role: string;
}

interface TokenVerificationResponse {
	isValid: boolean;
	data: TokenData | null;
}

interface JwtPayload {
	id: string;
	fullName: string;
	status: string;
	role: string;
}
export interface RequestWithUser extends Request {
	user: TokenData; // Add 'user' property to the request object
}

// Error handler for JWT validation
const jwtErrorHandler = (err: Error, res: Response): void => {
	res.status(401).json({
		message: "Unauthorized",
		detail: err.message,
	});
};

// Function to extract token data from the request's Authorization header
export const getUserDataOnToken = (req: Request): TokenData | null => {
	try {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		const authorization = req.headers["authorization"];
		if (!authorization || !authorization.startsWith("Bearer ")) {
			throw new Error("Invalid or missing Authorization header");
		}

		const token = authorization.split(" ")[1]; // Extract the token after "Bearer "
		const secretKey = process.env.JWT_SECRET_KEY as string;
		// console.log("JWT Secret Key:", secretKey);

		const decoded = jwt.verify(token, secretKey) as JwtPayload;

		if (
			typeof decoded !== "object" ||
			!("id" in decoded) ||
			!("role" in decoded)
		) {
			throw new Error("Invalid token structure");
		}

		const { id, fullName, status, role } = decoded;
		return { id, fullName, status, role };
	} catch (error) {
		console.error("Token verification error:", (error as Error).message);
		return null;
	}
};

// Token verification function
export const tokenVerification = async (
	req: Request,
): Promise<TokenVerificationResponse> => {
	try {
		// Check token from header
		const tokenFromHeader = getUserDataOnToken(req);
		if (!tokenFromHeader) return { isValid: false, data: null };

		return { isValid: true, data: tokenFromHeader };
	} catch (error) {
		console.error("Error in token verification:", error);
		return { isValid: false, data: null };
	}
};

// JWT Middleware for Express with token verification and storing user data in req.user
export const CheckAuthorizationMiddleware = () => {
	return async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			// Verify the token and get token data
			const tokenResponse = await tokenVerification(req);

			if (!tokenResponse.isValid || !tokenResponse.data) {
				res.status(403).json({
					message: "Invalid or missing token",
				});
				return; // Ensure the function exits after sending the response
			}

			// Attach the decoded token data to req.user
			req.user = tokenResponse.data;

			next(); // Proceed to the next middleware or route handler
		} catch (error) {
			jwtErrorHandler(error as Error, res);
		}
	};
};

//================================================================
export const checkAuthorizationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const token = req.headers["authorization"];
	if (token) {
		const accessToken: string = token.replace("Bearer ", "");
		const payloadData = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
		(req as RequestWithUser).user = payloadData;
	} else {
		res.status(401).json({
			message: messages.UNAUTHORIZED,
			detail: "Unauthorized to access this route",
		});
		return;
	}
	next();
};

export const checkAuthorizationManagerRole = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = (req as RequestWithUser).user;
	if (user.role !== "EV_MANAGER") {
		res.status(403).json({
			message: messages.FORBIDDEN,
			detail: "Permission denied to access this route",
		});
		return;
	}
	next();
};

export const checkAuthorizationStaffRole = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = (req as RequestWithUser).user;
	if (user.role !== "EV_STAFF" && user.role !== "EV_MANAGER") {
		res.status(403).json({
			message: messages.FORBIDDEN,
			detail: "Permission denied to access this route",
		});
		return;
	}
	next();
};

export const checkAuthorizationAdminRole = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = (req as RequestWithUser).user;
	if (
		user.role !== "EV_ADMIN" &&
		user.role !== "EV_STAFF" &&
		user.role !== "EV_MANAGER"
	) {
		res.status(403).json({
			message: messages.FORBIDDEN,
			detail: "Permission denied to access this route",
		});
		return;
	}
	next();
};
