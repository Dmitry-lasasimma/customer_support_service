import type { Request, Response, NextFunction } from "express";

export const validateCreateTheme = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { name } = req.body;
	const errors: string[] = [];

	if (typeof name !== "string" || name.trim().length === 0) {
		errors.push("Name is required and must be a non-empty string.");
	}
	if (errors.length > 0) {
		res.status(400).json({
			message: "Validation failed",
			errors,
		});
		return;
	}

	next();
};
export const validateParamID = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// const { question, answer } = req.body;
	const errors: string[] = [];
	const id = req.params.id;
	// const { id } = req.query; // Extracting the 'id' from the query string
	if (!id || typeof id !== "string") {
		errors.push("Please provide a valid ID in the query.");
	}
	if (errors.length > 0) {
		res.status(400).json({
			message: "Validation failed",
			errors,
		});
		return;
	}

	next();
};
// export const validateUpdateTheme = (req: Request, res: Response, next: NextFunction): void => {
//     // const { question, answer } = req.body;
//     const errors: string[] = [];
//     const id = req.params.id;
//     if (!id || typeof id !== 'string') {
//         errors.push('Please provide a valid ID in the query.');
//     }
//     if (errors.length > 0) {
//          res.status(400).json({
//             message: 'Validation failed',
//             errors
//         });
//         return;
//     }

//     next();
// };
// export const validateDeleteTheme = (req: Request, res: Response, next: NextFunction): void => {
//     // const { question, answer } = req.body;
//     const errors: string[] = [];
//     const id = req.params.id;
//     if (!id || typeof id !== 'string') {
//         errors.push('Please provide a valid ID in the query.');
//     }
//     if (errors.length > 0) {
//          res.status(400).json({
//             message: 'Validation failed',
//             errors
//         });
//         return;
//     }

//     next();
// };
