import dotenv from "dotenv";
import { type IFAQ, faqModel } from "../models/faq";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdFAQService = async (
	question: string,
	answer: string,
	isActive: boolean,
	userData: TokenData,
): Promise<IFAQ | null> => {
	try {
		// Check if the user already exists
		const existingQuestion = await faqModel.findOne({ question });
		if (existingQuestion) {
			// throw new Error("Error Question already exists");
			throw new Error(`An FAQ with the question ${question} already exists.`);
		}
		// var createdBy = userData.id
		// Create new user
		const newFAQ = new faqModel({
			question,
			answer,
			isActive,
			createdBy: userData.id,
			createdByFullName: userData.fullName,
		});

		// Save the user to the database
		const savedFAQ = await newFAQ.save();

		// Return the created user without sensitive fields (e.g., pin)
		return savedFAQ;
	} catch (error) {
		console.log("Error creating FAQ: ", error);
		throw error;
	}
};
// GET
export const findFAQByIDService = async (id: string): Promise<IFAQ | null> => {
	try {
		// Convert the ID to ObjectId
		const faqId = new ObjectId(id);
		const FAQ = await faqModel.findOne({ _id: faqId }).exec();
		if (!FAQ) {
			return null;
		}
		return FAQ;
	} catch (error) {
		console.error("Error in findFAQByIDService:", error);
		throw error;
	}
};
// GET
export const findFAQsByQuestionService = async (
	question: string,
	skip: number,
	limit: number,
) => {
	try {
		const faqs = await faqModel
			.find({ question: { $regex: new RegExp(question, "i") } }) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return faqs;
	} catch (error) {
		console.error("Error in findFAQsByQuestionService:", error);
		throw error;
	}
};
export const findAllFAQsService = async (skip: number, limit: number) => {
	try {
		const faqs = await faqModel
			.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return faqs;
	} catch (error) {
		console.error("Error in findAllFAQsService:", error);
		throw error;
	}
};
export const findAllFAQsServiceCount = async () => {
	try {
		const faqsCount = await faqModel.countDocuments({}).exec();

		return faqsCount;
	} catch (error) {
		console.error("Error in findAllFAQsService:", error);
		throw error;
	}
};
//PUT
export const updateFAQByIDService = async (
	id: string,
	updateData: { question: string; answer: string; isActive: boolean },
	userData: TokenData,
) => {
	try {
		const updatedFAQ = await faqModel
			.findByIdAndUpdate(
				{ _id: new ObjectId(id) },
				{
					...updateData,
					updatedBy: userData.id,
					updatedByFullName: userData.fullName,
					updatedAt: new Date(),
				}, // Update fields and set updatedBy and updatedAt
				{ new: true, runValidators: true }, // Return the updated document and run validation on updates
			)
			.exec();

		return updatedFAQ;
	} catch (error) {
		console.error("Error in updateFAQByIDService:", error);
		throw error;
	}
};
// DELETE
export const deleteFAQByIDService = async (id: string) => {
	try {
		const deletedFAQ = await faqModel
			.findByIdAndDelete({ _id: new ObjectId(id) })
			.exec();
		return deletedFAQ;
	} catch (error) {
		console.error("Error in deleteFAQByIDService:", error);
		throw error;
	}
};

//     findFAQByIDService: async (id: string) => {
//         try {
//             const FAQ = await faqModel.findById({ _id: new ObjectId(id) })
//                 .populate('createdBy', 'firstName lastName email role')  // Populate 'createdBy'
//                 .populate('updatedBy', 'firstName lastName email role')  // Populate 'updatedBy'
//                 .exec();

//             if (!FAQ) {
//                 return null;
//             }
//             return FAQ;
//         } catch (error) {
//             console.error('Error in findFAQByIDService:', error);
//             throw new Error('Failed to retrieve FAQ data');
//         }
//     }
// };
