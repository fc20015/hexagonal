import { Router } from "express";
import { RoleController } from "../../adapters/in/RoleController.js";

const router = Router();

router.get("/roles", (req, res) => RoleController.findAll(req, res));
router.get("/roles/:id", (req, res) => RoleController.findById(req, res));
router.post("/roles", (req, res) => RoleController.save(req, res));

export const RoleRouter = router;
