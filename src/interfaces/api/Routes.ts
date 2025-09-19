import { Router } from "express";
import { RoleController } from "../../adapters/in/RoleController.js";
import { PermissionController } from "../../adapters/in/PermissionController.js";
import { UserController } from "../../adapters/in/UserController.js";
import { AuthController } from "../../adapters/in/AuthController.js";
import { authorize } from "../../infraestructure/http/middlewares/authorize.js";
import { accessTokenRepository } from "../../shared/ServiceContainer.js";

const router = Router();

//permissions

router.get(
  "/permissions",
  authorize(["permissions.view"], accessTokenRepository),
  (req, res) => PermissionController.findAll(req, res)
); // get all permissions
router.get(
  "/permissions/:id",
  authorize(["permissions.view"], accessTokenRepository),
  (req, res) => PermissionController.findById(req, res)
); // get permission by id
router.post(
  "/permissions",
  authorize(["permissions.create"], accessTokenRepository),
  (req, res) => PermissionController.create(req, res)
); // create new permission
router.put(
  "/permissions",
  authorize(["permissions.update"], accessTokenRepository),
  (req, res) => PermissionController.update(req, res)
); // update permission
router.delete(
  "/permissions/:id",
  authorize(["permissions.delete"], accessTokenRepository),
  (req, res) => PermissionController.delete(req, res)
); // delete permission

// roles

router.get(
  "/roles",
  authorize(["roles.view"], accessTokenRepository),
  (req, res) => RoleController.findAll(req, res)
); // get all roles
router.get(
  "/roles/:id",
  authorize(["roles.view"], accessTokenRepository),
  (req, res) => RoleController.findById(req, res)
); // get role by id
router.get(
  "/roles/:id/permissions",
  authorize(["roles.view", "permissions.view"], accessTokenRepository),
  (req, res) => RoleController.getPermissions(req, res)
); // get permissions associated with the role
router.post(
  "/roles",
  authorize(["roles.create"], accessTokenRepository),
  (req, res) => RoleController.create(req, res)
); // create new role
router.delete(
  "/roles/:id",
  authorize(["roles.delete"], accessTokenRepository),
  (req, res) => RoleController.delete(req, res)
); // delete role
router.put(
  "/roles",
  authorize(["roles.update"], accessTokenRepository),
  (req, res) => RoleController.update(req, res)
); // update role

//users

router.post(
  "/users",
  authorize(["users.create"], accessTokenRepository),
  (req, res) => UserController.create(req, res)
); //create new user
router.get(
  "/users",
  authorize(["users.view.all"], accessTokenRepository),
  (req, res) => UserController.getAll(req, res)
); //get all users
router.get(
  "/users/:field",
  authorize(
    ["users.view.all", "users.view.own"],
    accessTokenRepository,
    ["query"],
    "value"
  ),
  (req, res) => UserController.getBy(req, res)
); //get user by
router.get(
  "/users/:id/profile",
  authorize(["users.view.all", "users.view.own"], accessTokenRepository),
  (req, res) => UserController.getProfile(req, res)
); //get user profile
router.get(
  "/users/:id/permissions",
  authorize(["users.view.all", "users.view.own"], accessTokenRepository),
  (req, res) => UserController.getPermissions(req, res)
); //get user permissions
router.get(
  "/users/:id/roles",
  authorize(["users.view.all", "users.view.own"], accessTokenRepository),
  (req, res) => UserController.getRoles(req, res)
); //get user roles
router.put(
  "/users/:id",
  authorize(["users.update", "users.update.own"], accessTokenRepository, [
    "params",
    "body",
  ]),
  (req, res) => UserController.update(req, res)
); //update user info
router.delete(
  "/users/:id",
  authorize(["users.delete"], accessTokenRepository),
  (req, res) => UserController.delete(req, res)
); //delete user

//authentication
router.post("/auth/login", (req, res) => AuthController.login(req, res));
router.post("/auth/refresh", (req, res) => AuthController.refresh(req, res));
router.post("/auth/logout", (req, res) => AuthController.logout(req, res));

export const RoleRouter = router;
