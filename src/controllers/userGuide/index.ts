import type { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
	createdUserGuideService,
	findUserGuideByIDService,
	findUserGuidesByTitleService,
	findAllUserGuidesService,
	findAllUserGuidesServiceCount,
	updateUserGuideByIDService,
	deleteUserGuideByIDService,
} from "../../services/userGuide";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";

export const createUserGuide = async (req: Request, res: Response) => {
	try {
		const user = (req as RequestWithUser).user;
		const { type, title, description, video, isActive, language } = req.body;

		const record = await createdUserGuideService(
			type,
			title,
			description,
			video,
			isActive,
			language,
			user,
		);

		res.status(200).json({
			message: "Create Successful",
			record,
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
// export const createUserGuide = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { type, title, description, video, isActive, language} = req.body;

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
//          const record = await createdUserGuideService(type, title, description, video, isActive, language, user)

//          return res.status(200).json({
//              message: "Create Successful",
//              record
//          })
//     } catch (error) {
//         console.log("error: ", error)
//         res.status(500).json({
//             message: messages.INTERNAL_SERVER_ERROR,
//             detail: (error as Error).message
//         });
//     }
// };

export const getUserGuideByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const data = await findUserGuideByIDService(id);

		if (!data) {
			res.status(404).json({
				message: messages.NOT_FOUND,
				detail: "data not found with this id",
			});
			return;
		}

		res.status(200).json({
			message: "Get data successfully",
			data,
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
// export const getUserGuideByID = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { id } = req.query;  // Extract the 'id' from the query string
//         if (!id || typeof id !== 'string') {
//             return res.status(400).json({
//                 message: 'Invalid or missing ID in query parameters',
//                 detail: 'Please provide a valid FAQ ID in the query string.'
//             });
//         }

//         const data = await findUserGuideByIDService(id);

//         if (!data) {
//             return res.status(404).json({
//                 message: messages.NOT_FOUND,
//                 detail: 'data not found with this id'
//             })
//         }

//         return res.status(200).json({
//             message: 'Get data successfully',
//             data
//         })
//     } catch (error) {
//         console.log("error: ", error)
//         return res.status(500).json({
//             message: messages.INTERNAL_SERVER_ERROR,
//             detail: (error as Error).message
//         })
//     }
// }

export const getUserGuides = async (req: Request, res: Response) => {
	try {
		const { title, skip, limit } = req.query; // Extract 'question', 'skip', and 'limit' from query string
		// Ensure skip and limit are valid numbers
		const parsedSkip = Number.parseInt(skip as string, 10) || 0;
		const parsedLimit = Number.parseInt(limit as string, 10) || 10;

		// If a question is provided, search by question; otherwise, get all FAQs
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let Data;
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let RecordsCount;
		if (title && typeof title === "string") {
			Data = await findUserGuidesByTitleService(title, parsedSkip, parsedLimit);
			RecordsCount = await findAllUserGuidesServiceCount();
		} else {
			Data = await findAllUserGuidesService(parsedSkip, parsedLimit);
			RecordsCount = await findAllUserGuidesServiceCount();
		}

		if (!Data || Data.length === 0) {
			res.status(404).json({
				message: "No data found",
				detail: "No data match the provided criteria",
			});
			return;
		}

		res.status(200).json({
			total: RecordsCount,
			message: "Get data successfully",
			Data,
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
// export const getUserGuides = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { title, skip, limit} = req.query; // Extract 'question', 'skip', and 'limit' from query string
//         // Ensure skip and limit are valid numbers
//         const parsedSkip = parseInt(skip as string, 10) || 0;
//         const parsedLimit = parseInt(limit as string, 10) || 10;

//         // If a question is provided, search by question; otherwise, get all FAQs
//         let Data;
//         let RecordsCount;
//         if (title && typeof title === 'string') {
//             Data = await findUserGuidesByTitleService(title, parsedSkip, parsedLimit);
//             RecordsCount = await findAllUserGuidesServiceCount();
//         } else {
//             Data = await findAllUserGuidesService(parsedSkip, parsedLimit);
//             RecordsCount = await findAllUserGuidesServiceCount();
//         }

//         if (!Data || Data.length === 0) {
//             return res.status(404).json({
//                 message: 'No data found',
//                 detail: 'No data match the provided criteria'
//             });
//         }

//         return res.status(200).json({
//             total: RecordsCount,
//             message: 'Get data successfully',
//             Data
//         });
//     } catch (error) {
//         console.log("error: ", error);
//         return res.status(500).json({
//             message: 'Internal Server Error',
//             detail: (error as Error).message
//         });
//     }
// };

export const updateUserGuideByID = async (req: Request, res: Response) => {
	try {
		const { type, title, description, video, isActive, language } = req.body; // Extract update data from request body
		const id = req.params.id;
		const user = (req as RequestWithUser).user;

		// Update the FAQ via the service function
		const updatedRecord = await updateUserGuideByIDService(
			id,
			{ type, title, description, video, isActive, language },
			user,
		);

		if (!updatedRecord) {
			res.status(404).json({
				message: "data not found",
				detail: `No data found with the ID ${id}`,
			});
			return;
		}

		res.status(200).json({
			message: "data updated successfully",
			updatedRecord,
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
// export const updateUserGuideByID = async (req: RequestWithUser, res: Response) => {
//     try {
//         const { type, title, description, video, isActive, language } = req.body; // Extract update data from request body

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
//         const updatedRecord = await updateUserGuideByIDService(id, { type, title, description, video, isActive, language }, user);

//         if (!updatedRecord) {
//             return res.status(404).json({
//                 message: 'data not found',
//                 detail: `No data found with the ID ${id}`,
//             });
//         }

//         return res.status(200).json({
//             message: 'data updated successfully',
//             updatedRecord,
//         });
//     } catch (error) {
//         console.log("error: ", error);
//         return res.status(500).json({
//             message: 'Internal Server Error',
//             detail: (error as Error).message,
//         });
//     }
// };

export const deleteUserGuideByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const deletedRecord = await deleteUserGuideByIDService(id);

		if (!deletedRecord) {
			res.status(404).json({
				message: "data not found",
				detail: `No data found with the ID ${id}`,
			});
			return;
		}

		res.status(200).json({
			message: "data deleted successfully",
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
// export const deleteUserGuideByID = async (req: RequestWithUser, res: Response) => {
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

//         const deletedRecord = await deleteUserGuideByIDService(id);

//         if (!deletedRecord) {
//             return res.status(404).json({
//                 message: 'data not found',
//                 detail: `No data found with the ID ${id}`,
//             });
//         }

//         return res.status(200).json({
//             message: 'data deleted successfully',
//         });
//     } catch (error) {
//         console.log("error: ", error);
//         return res.status(500).json({
//             message: 'Internal Server Error',
//             detail: (error as Error).message,
//         });
//     }
// };
