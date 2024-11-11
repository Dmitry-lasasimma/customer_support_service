import express, { Request, Response } from "express";
import {
	createUserGuide,
	getUserGuideByID,
	getUserGuides,
	updateUserGuideByID,
	deleteUserGuideByID,
} from "../controllers/userGuide";
import {
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
} from "../middlewares";
import {
	validateCreateUserGuide,
	validateParamID,
} from "../validators/userGuide";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateCreateUserGuide,
	createUserGuide,
);
// router.post('/create-user-guide', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     createUserGuide(req, res);
// });

router.get(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	getUserGuideByID,
);
// router.get('/get-user-guide', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     getUserGuideByID(req, res);
// });

router.get("/", checkAuthorizationMiddleware, getUserGuides);
// router.get('/get-many-user-guide', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     getUserGuides(req, res);
// })

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	updateUserGuideByID,
);
// router.put('/update-user-guide', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     updateUserGuideByID(req, res);
// })

router.delete(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	deleteUserGuideByID,
);
// router.delete('/delete-user-guide', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     deleteUserGuideByID(req, res);
// })

export default router;
