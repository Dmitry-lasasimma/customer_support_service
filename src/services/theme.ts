import dotenv from "dotenv";
import { type ITheme, ThemeModel } from "../models/theme";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdThemeService = async (
	name: string,
	splashBackground: string,
	splashIcon: string,
	loginIcon: string,
	walletBackground: string,
	chargingBackground: string,
	popupIcon: string,
	userData: TokenData,
): Promise<ITheme | null> => {
	try {
		// Check if the user already exists
		const existingName = await ThemeModel.findOne({ name });
		if (existingName) {
			// throw "404";
			throw new Error(`A Theme with the name ${name} already exists.`);
		}
		// Create new
		const newRecord = new ThemeModel({
			name,
			splashBackground,
			splashIcon,
			loginIcon,
			walletBackground,
			chargingBackground,
			popupIcon,
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
export const findThemeByIDService = async (
	id: string,
): Promise<ITheme | null> => {
	try {
		const Record = await ThemeModel.findOne({ _id: new ObjectId(id) }).exec();

		if (!Record) {
			return null;
		}
		return Record;
	} catch (error) {
		console.error("Error in findThemeByIDService:", error);
		throw error;
	}
};
// GET
export const findThemesByNameService = async (
	name: string,
	skip: number,
	limit: number,
) => {
	try {
		const faqs = await ThemeModel.find({
			title: { $regex: new RegExp(name, "i") },
		}) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return faqs;
	} catch (error) {
		console.error("Error in findThemesByNameService:", error);
		throw error;
	}
};
export const findAllThemesService = async (skip: number, limit: number) => {
	try {
		const faqs = await ThemeModel.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return faqs;
	} catch (error) {
		console.error("Error in findAllThemesService:", error);
		throw error;
	}
};
export const findAllThemesServiceCount = async () => {
	try {
		const faqsCount = await ThemeModel.countDocuments({}).exec();

		return faqsCount;
	} catch (error) {
		console.error("Error in findAllThemesServiceCount:", error);
		throw error;
	}
};
//PUT
export const updateThemeByIDService = async (
	id: string,
	updateData: {
		name: string;
		splashBackground: string;
		splashIcon: string;
		loginIcon: string;
		walletBackground: string;
		chargingBackground: string;
		popupIcon: string;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await ThemeModel.findByIdAndUpdate(
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
		console.error("Error in updateThemeByIDService:", error);
		throw error;
	}
};
// DELETE
export const deleteThemeByIDService = async (id: string) => {
	try {
		const deletedRecord = await ThemeModel.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteThemeByIDService:", error);
		throw error;
	}
};
