import mongoose, { type Document, Schema } from "mongoose";

enum UserGuideEnum {
	MANUAL = "MANUAL",
	VIDEO = "VIDEO",
}

export interface IUserGuide extends Document {
	type: UserGuideEnum;
	title: string;
	description: string;
	video: string;
	isActive: boolean;
	language: string;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedByFullName: string;
}

const UserGuideSchema = new Schema({
	type: {
		type: String,
		enum: Object.values(UserGuideEnum),
		default: UserGuideEnum.MANUAL,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	video: {
		type: String,
		required: false,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	language: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
	},
	updatedByFullName: {
		type: String,
	},
	createdByFullName: {
		type: String,
	},
});

export const UserGuideModel = mongoose.model<IUserGuide>(
	"UserGuide",
	UserGuideSchema,
);
