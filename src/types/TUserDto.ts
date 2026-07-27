import type { TUser } from "./TUser"

export type TUserDto = {
  message: string,
  httpStatus: string,
  data: TUser
}