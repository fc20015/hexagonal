import { Router } from "express";
import { RoleController } from "../../adapters/in/RoleController.js";
import { PermissionController } from "../../adapters/in/PermissionController.js";
import { UserController } from "../../adapters/in/UserController.js";

const router = Router();

//permissions
router.get("/permissions", (req, res) =>
  PermissionController.findAll(req, res)
);
router.get("/permissions/:id", (req, res) =>
  PermissionController.findById(req, res)
);
router.post("/permissions", (req, res) =>
  PermissionController.create(req, res)
);
router.put("/permissions", (req, res) => PermissionController.update(req, res));
router.delete("/permissions/:id", (req, res) =>
  PermissionController.delete(req, res)
);
// roles
router.get("/roles", (req, res) => RoleController.findAll(req, res));
router.get("/roles/:id", (req, res) => RoleController.findById(req, res));
router.get("/roles/:id/permissions", (req, res) =>
  RoleController.getPermissions(req, res)
);
router.post("/roles", (req, res) => RoleController.create(req, res));
router.delete("/roles/:id", (req, res) => RoleController.delete(req, res));
router.put("/roles", (req, res) => RoleController.update(req, res));

//users
router.post("/users", (req, res) => UserController.create(req, res));
router.get("/users/:id", (req, res) => UserController.findById(req, res));
router.get("/users/:id/roles", (req, res) => UserController.getRoles(req, res));
router.put("/users/:id/roles", (req, res) => UserController.addRoles(req, res));

export const RoleRouter = router;
