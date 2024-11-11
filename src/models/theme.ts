import mongoose, { type Document, Schema } from "mongoose";

export interface ITheme extends Document {
	name: string;
	splashBackground: string;
	splashIcon: string;
	loginIcon: string;
	walletBackground: string;
	chargingBackground: string;
	popupIcon: string;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedByFullName: string;
}

const ThemeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	splashBackground: {
		type: String,
		required: false,
	},
	splashIcon: {
		type: String,
		required: false,
	},
	loginIcon: {
		type: String,
		required: false,
	},
	walletBackground: {
		type: String,
		required: false,
	},
	chargingBackground: {
		type: String,
		required: false,
	},
	popupIcon: {
		type: String,
		required: false,
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

export const ThemeModel = mongoose.model<ITheme>("Theme", ThemeSchema);
