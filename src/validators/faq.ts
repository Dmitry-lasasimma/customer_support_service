import type { Request, Response, NextFunction } from "express";

export const validateCreateFAQ = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { question, answer } = req.body;
	const errors: string[] = [];

	if (typeof question !== "string" || question.trim().length === 0) {
		errors.push("Question is required and must be a non-empty string.");
	}
	if (typeof answer !== "string" || answer.trim().length === 0) {
		errors.push("Answer is required and must be a non-empty string.");
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
// export const validateUpdateFAQ = (req: Request, res: Response, next: NextFunction): void => {
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
// export const validateDeleteFAQ = (req: Request, res: Response, next: NextFunction): void => {
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
