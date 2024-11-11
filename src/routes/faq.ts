// import express, { Request, Response } from 'express';
import express from "express";
import {
	createFAQ,
	getFAQbyID,
	getFAQs,
	updateFAQbyID,
	deleteFAQbyID,
} from "../controllers/faq";
import {
	// CheckAuthorizationMiddleware,
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
} from "../middlewares";
import { validateCreateFAQ, validateParamID } from "../validators/faq";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateCreateFAQ,
	createFAQ,
);
// router.post('/', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     createFAQ(req, res);
// });

router.get("/:id", checkAuthorizationMiddleware, validateParamID, getFAQbyID);
// router.get(
//   "/get-faq",
//   CheckAuthorizationMiddleware(),
//   (req: Request, res: Response) => {
//     getFAQbyID(req, res);
//   }
// );

router.get("/", checkAuthorizationMiddleware, getFAQs);
// router.get(
//   "/get-many-faq",
//   CheckAuthorizationMiddleware(),
//   (req: Request, res: Response) => {
//     getFAQs(req, res);
//   }
// );

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	updateFAQbyID,
);
// router.put(
//   "/update-faq",
//   CheckAuthorizationMiddleware(),
//   (req: Request, res: Response) => {
//     updateFAQbyID(req, res);
//   }
// );

router.delete(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	deleteFAQbyID,
);
// router.delete(
//   "/delete-faq",
//   CheckAuthorizationMiddleware(),
//   (req: Request, res: Response) => {
//     deleteFAQbyID(req, res);
//   }
// );

export default router;
