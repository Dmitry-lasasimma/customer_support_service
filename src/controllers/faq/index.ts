import type { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
	createdFAQService,
	findFAQByIDService,
	findFAQsByQuestionService,
	findAllFAQsService,
	findAllFAQsServiceCount,
	updateFAQByIDService,
	deleteFAQByIDService,
} from "../../services/faq";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";

export const createFAQ = async (req: Request, res: Response) => {
	try {
		const user = (req as RequestWithUser).user;
		const { question, answer, isActive } = req.body;

		const FAQ = await createdFAQService(question, answer, isActive, user);

		res.status(201).json({
			message: "Create Successful",
			FAQ,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};
// export const createFAQ = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { question, answer, isActive } = req.body;

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 message: messages.BAD_REQUEST, details: errors.array().map(err => ({
//                     detail: err.msg
//                 }))
//             });
//         }
//         const user = req.user;  // Safely access 'user'
//         if (!user) {
//             return res.status(403).json({
//                 message: 'User not found or unauthorized'
//             });
//         }
//          //Create user with Create User Service
//          const FAQ = await createdFAQService(question, answer, isActive, user)

//          return res.status(200).json({
//              message: "Create FAQ Successful",
//              FAQ
//          })
//     } catch (error) {
//         console.log("error: ", error)
//         res.status(500).json({
//             message: messages.INTERNAL_SERVER_ERROR,
//             detail: (error as Error).message
//         });
//     }
// };

export const getFAQbyID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const FAQ = await findFAQByIDService(id);

		if (!FAQ) {
			res.status(404).json({
				message: "FAQ not found with this id",
			});
			return;
		}
		res.status(200).json({
			message: "Get FAQ successfully",
			FAQ,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};
// export const getFAQbyID = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.query;  // Extract the 'id' from the query string
//         if (!id || typeof id !== 'string') {
//             return res.status(400).json({
//                 message: 'Invalid or missing ID in query parameters',
//                 detail: 'Please provide a valid FAQ ID in the query string.'
//             });
//         }

//         const FAQ = await findFAQByIDService(id);

//         if (!FAQ) {
//             return res.status(404).json({
//                 message: messages.NOT_FOUND,
//                 detail: 'FAQ not found with this id'
//             })
//         }

//         return res.status(200).json({
//             message: 'Get FAQ successfully',
//             FAQ
//         })
//     } catch (error) {
//         console.log("error: ", error)
//         return res.status(500).json({
//             message: messages.INTERNAL_SERVER_ERROR,
//             detail: (error as Error).message
//         })
//     }
// }

export const getFAQs = async (req: Request, res: Response) => {
	try {
		const { question, skip, limit } = req.query; // Extract 'question', 'skip', and 'limit' from query string
		// Ensure skip and limit are valid numbers
		// const id = req.params.id;
		const parsedSkip = Number.parseInt(skip as string, 10) || 0;
		const parsedLimit = Number.parseInt(limit as string, 10) || 10;

		// If a question is provided, search by question; otherwise, get all FAQs
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let FAQs;
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let FAQsCount;
		if (question && typeof question === "string") {
			FAQs = await findFAQsByQuestionService(question, parsedSkip, parsedLimit);
			FAQsCount = await findAllFAQsServiceCount();
		} else {
			FAQs = await findAllFAQsService(parsedSkip, parsedLimit);
			FAQsCount = await findAllFAQsServiceCount();
		}

		if (!FAQs || FAQs.length === 0) {
			res.status(404).json({
				message: "No FAQs found",
				detail: "No FAQs match the provided criteria",
			});
			return;
		}

		res.status(200).json({
			total: FAQsCount,
			message: "Get FAQs successfully",
			FAQs,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};
// export const getFAQs = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { question, skip, limit} = req.query; // Extract 'question', 'skip', and 'limit' from query string
//         // Ensure skip and limit are valid numbers
//         const parsedSkip = parseInt(skip as string, 10) || 0;
//         const parsedLimit = parseInt(limit as string, 10) || 10;

//         // If a question is provided, search by question; otherwise, get all FAQs
//         let FAQs;
//         let FAQsCount;
//         if (question && typeof question === 'string') {
//             FAQs = await findFAQsByQuestionService(question, parsedSkip, parsedLimit);
//             FAQsCount = await findAllFAQsServiceCount();
//         } else {
//             FAQs = await findAllFAQsService(parsedSkip, parsedLimit);
//             FAQsCount = await findAllFAQsServiceCount();
//         }

//         if (!FAQs || FAQs.length === 0) {
//             return res.status(404).json({
//                 message: 'No FAQs found',
//                 detail: 'No FAQs match the provided criteria'
//             });
//         }

//         return res.status(200).json({
//             total: FAQsCount,
//             message: 'Get FAQs successfully',
//             FAQs
//         });
//     } catch (error) {
//         console.log("error: ", error);
//         return res.status(500).json({
//             message: 'Internal Server Error',
//             detail: (error as Error).message
//         });
//     }
// };

export const updateFAQbyID = async (req: Request, res: Response) => {
	try {
		const { question, answer, isActive } = req.body; // Extract update data from request body
		const id = req.params.id;
		const user = (req as RequestWithUser).user;
		// Update the FAQ via the service function
		const updatedFAQ = await updateFAQByIDService(
			id,
			{ question, answer, isActive },
			user,
		);
		if (!updatedFAQ) {
			res.status(404).json({
				message: "FAQ not found",
				detail: `No FAQ found with the ID ${id}`,
			});
			return;
		}
		res.status(200).json({
			message: "FAQ updated successfully",
			updatedFAQ,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};
// export const updateFAQbyID = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { question, answer, isActive } = req.body; // Extract update data from request body

//         const { id } = req.query; // Extracting the 'id' from the query string
//         if (!id || typeof id !== 'string') {
//             return res.status(400).json({
//                 message: 'Invalid or missing ID in query parameters',
//                 detail: 'Please provide a valid FAQ ID in the query string.'
//             });
//         }

//         const user = req.user;  // Safely access 'user'
//         // check user
//         if (!user) {
//             return res.status(403).json({
//                 message: 'User not found or unauthorized'
//             });
//         }

//         // Update the FAQ via the service function
//         const updatedFAQ = await updateFAQByIDService(id, { question, answer, isActive }, user);

//         if (!updatedFAQ) {
//             return res.status(404).json({
//                 message: 'FAQ not found',
//                 detail: `No FAQ found with the ID ${id}`,
//             });
//         }

//         return res.status(200).json({
//             message: 'FAQ updated successfully',
//             updatedFAQ,
//         });
//     } catch (error) {
//         console.log("error: ", error);
//         return res.status(500).json({
//             message: 'Internal Server Error',
//             detail: (error as Error).message,
//         });
//     }
// };

export const deleteFAQbyID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		// Delete the FAQ via the service function
		const deletedFAQ = await deleteFAQByIDService(id);

		if (!deletedFAQ) {
			res.status(404).json({
				message: "FAQ not found",
				detail: `No FAQ found with the ID ${id}`,
			});
			return;
		}

		res.status(200).json({
			message: "FAQ deleted successfully",
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};
// export const deleteFAQbyID = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { id } = req.query; // Extracting the 'id' from the query string
//         if (!id || typeof id !== 'string') {
//             return res.status(400).json({
//                 message: 'Invalid or missing ID in query parameters',
//                 detail: 'Please provide a valid FAQ ID in the query string.'
//             });
//         }

//         const user = req.user;  // Safely access 'user'
//         // Verify Token
//         if (!user) {
//             return res.status(403).json({
//                 message: 'User not found or unauthorized'
//             });
//         }

//         // Delete the FAQ via the service function
//         const deletedFAQ = await deleteFAQByIDService(id);

//         if (!deletedFAQ) {
//             return res.status(404).json({
//                 message: 'FAQ not found',
//                 detail: `No FAQ found with the ID ${id}`,
//             });
//         }

//         return res.status(200).json({
//             message: 'FAQ deleted successfully',
//         });
//     } catch (error) {
//         console.log("error: ", error);
//         return res.status(500).json({
//             message: 'Internal Server Error',
//             detail: (error as Error).message,
//         });
//     }
// };
