import { Router } from "express";
import {
  fetchScrumSquads,
  postSquad,
} from "../../src/controllers/scrumsquadcontroller";

const squadRouter = Router();

squadRouter.get("/squad", fetchScrumSquads);
squadRouter.post("/squad", postSquad);

export default squadRouter;
