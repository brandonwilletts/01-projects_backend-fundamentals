import { Router, type Request, type Response } from "express";
import { logRequest } from "../utils.js";

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
	logRequest(req);
	res.status(200).send('status ok');
});