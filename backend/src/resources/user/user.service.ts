import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { UserDTO } from "./user.types";

const prisma = new PrismaClient();

export const userService = {
  async register(data: UserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        userType: data.userType,
      },
      select: { id: true, name: true, email: true, userType: true },
    });
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("user_not_found");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("invalid_credentials");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    };
  },

  async list() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, userType: true },
    });
  },

  async getById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, userType: true },
    });
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },

  async update(id: number, data: Partial<UserDTO>) {
    const updateData: Prisma.UserUpdateInput = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, userType: true },
    });
  },
};
