import express, { Request, Response } from "express";
import {
	createTheme,
	getThemeByID,
	getThemes,
	updateThemeByID,
	deleteThemeByID,
} from "../controllers/theme";
import {
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
} from "../middlewares";
import { validateCreateTheme, validateParamID } from "../validators/theme";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateCreateTheme,
	createTheme,
);
// router.post('/create-theme', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     createTheme(req, res);
// });

router.get("/:id", checkAuthorizationMiddleware, validateParamID, getThemeByID);
// router.get('/get-theme', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     getThemeByID(req, res);
// });

router.get("/", checkAuthorizationMiddleware, getThemes);
// router.get('/get-many-theme', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     getThemes(req, res);
// })

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	updateThemeByID,
);
// router.put('/update-theme', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     updateThemeByID(req, res);
// })

router.delete(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	deleteThemeByID,
);
// router.delete('/delete-theme', CheckAuthorizationMiddleware(), (req: Request, res: Response) => {
//     deleteThemeByID(req, res);
// })

export default router;
