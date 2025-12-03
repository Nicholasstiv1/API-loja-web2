import { UserType } from "@prisma/client";

export interface UserDTO {
  id?: number;
  name: string;
  email: string;
  password: string;
  userType: UserType;
}
