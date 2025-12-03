import { Request, Response } from "express";
import { userService } from "./user.service";

export const userController = {
  async register(req: Request, res: Response) {
    const { name, email, password, userType } = req.body;

    const user = await userService.register({
      name,
      email,
      password,
      userType,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userService.login(email, password);

    req.session.userId = user.id;
    req.session.userType = user.userType;

    res.json({
      message: req.t("login_success"),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  },

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        throw new Error("unexpected_error");
      }
      res.json({ message: req.t("logout_success") });
    });
  },

  async list(req: Request, res: Response) {
    const users = await userService.list();
    res.json(users);
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await userService.getById(id);

    if (!user) {
      throw new Error("user_not_found");
    }

    res.json(user);
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (req.session.userType !== "admin") {
      throw new Error("access_denied");
    }

    await userService.delete(id);
    res.status(204).send();
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { name, email, password, userType } = req.body;

    if (req.session.userType !== "admin" && req.session.userId !== id) {
      throw new Error("access_denied");
    }

    const updatedUser = await userService.update(id, {
      name,
      email,
      password,
      userType,
    });

    if (!updatedUser) {
      throw new Error("user_not_found");
    }

    res.json(updatedUser);
  },

  async getMe(req: Request, res: Response) {
    if (!req.session.userId) {
      return res.status(401).json({ message: "not_authenticated" });
    }

    const user = await userService.getById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "user_not_found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    });
  },
};
