import { Router } from "express";
import { RoleController } from "../../adapters/in/RoleController.js";
import { PermissionController } from "../../adapters/in/PermissionController.js";
import { UserController } from "../../adapters/in/UserController.js";

const router = Router();

//permissions

router.get("/permissions", (req, res) =>
  PermissionController.findAll(req, res)
); // get all permissions
router.get("/permissions/:id", (req, res) =>
  PermissionController.findById(req, res)
); // get permission by id
router.post("/permissions", (req, res) =>
  PermissionController.create(req, res)
); // create new permission
router.put("/permissions", (req, res) => PermissionController.update(req, res)); // update permission
router.delete("/permissions/:id", (req, res) =>
  PermissionController.delete(req, res)
); // delete permission

// roles

router.get("/roles", (req, res) => RoleController.findAll(req, res)); // get all roles
router.get("/roles/:id", (req, res) => RoleController.findById(req, res)); // get role by id
router.get("/roles/:id/permissions", (req, res) =>
  RoleController.getPermissions(req, res)
); // get permissions associated with the role
router.post("/roles", (req, res) => RoleController.create(req, res)); // create new role
router.delete("/roles/:id", (req, res) => RoleController.delete(req, res)); // delete role
router.put("/roles", (req, res) => RoleController.update(req, res)); // update role

//users

router.post("/users", (req, res) => null); //create new user
router.get("/users", (req, res) => null); //get all users
router.get("/users/:field", (req, res) => null); //get user by
router.get("/users/:id/profile", (req, res) => null); //get user profile
router.get("/users/:id/permissions", (req, res) => null); //get user permissions
router.get("/users/:id/roles", (req, res) => null); //get user roles
router.put("/users/:id/permissions", (req, res) => null); //update user permissions
router.put("/users/:id/roles", (req, res) => null); //update user roles
router.put("/users/:id", (req, res) => null); //update user info
router.delete("/users/:id", (req, res) => null); //delete user

export const RoleRouter = router;
