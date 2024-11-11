import dotenv from "dotenv";
import { type IUserGuide, UserGuideModel } from "../models/userGuide";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdUserGuideService = async (
	type: string,
	title: string,
	description: string,
	video: string,
	isActive: boolean,
	language: string,
	userData: TokenData,
): Promise<IUserGuide | null> => {
	try {
		// Check if the user already exists
		const existingTitle = await UserGuideModel.findOne({ title });
		if (existingTitle) {
			// throw new Error("Error creating Record");
			throw new Error(`A User guide with the title ${title} already exists.`);
		}
		// var createdBy = userData.id
		// Create new user
		const newRecord = new UserGuideModel({
			type,
			title,
			description,
			isActive,
			video,
			language,
			createdBy: userData.id,
			createdByFullName: userData.fullName,
		});

		// Save the user to the database
		const savedRecord = await newRecord.save();

		return savedRecord;
	} catch (error) {
		console.log("Error creating Record: ", error);
		throw error;
	}
};
// GET
export const findUserGuideByIDService = async (
	id: string,
): Promise<IUserGuide | null> => {
	try {
		const Record = await UserGuideModel.findOne({
			_id: new ObjectId(id),
		}).exec();

		if (!Record) {
			return null;
		}
		return Record;
	} catch (error) {
		console.error("Error in findUserGuideByIDService:", error);
		throw error;
	}
};
// GET
export const findUserGuidesByTitleService = async (
	title: string,
	skip: number,
	limit: number,
) => {
	try {
		const faqs = await UserGuideModel.find({
			title: { $regex: new RegExp(title, "i") },
		}) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return faqs;
	} catch (error) {
		console.error("Error in findUserGuidesByTitleService:", error);
		throw error;
	}
};
export const findAllUserGuidesService = async (skip: number, limit: number) => {
	try {
		const faqs = await UserGuideModel.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return faqs;
	} catch (error) {
		console.error("Error in findAllUserGuidesService:", error);
		throw error;
	}
};
export const findAllUserGuidesServiceCount = async () => {
	try {
		const faqsCount = await UserGuideModel.countDocuments({}).exec();

		return faqsCount;
	} catch (error) {
		console.error("Error in findAllUserGuidesServiceCount:", error);
		throw error;
	}
};
//PUT
export const updateUserGuideByIDService = async (
	id: string,
	updateData: {
		type: string;
		title: string;
		description: string;
		video: string;
		isActive: boolean;
		language: string;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await UserGuideModel.findByIdAndUpdate(
			{ _id: new ObjectId(id) },
			{
				...updateData,
				updatedBy: userData.id,
				updatedByFullName: userData.fullName,
				updatedAt: new Date(),
			}, // Update fields and set updatedBy and updatedAt
			{ new: true, runValidators: true }, // Return the updated document and run validation on updates
		).exec();

		return updatedRecord;
	} catch (error) {
		console.error("Error in updateUserGuideByIDService:", error);
		throw error;
	}
};
// DELETE
export const deleteUserGuideByIDService = async (id: string) => {
	try {
		const deletedRecord = await UserGuideModel.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteUserGuideByIDService:", error);
		throw error;
	}
};

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
