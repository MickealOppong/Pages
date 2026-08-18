import type { TLocationResponse } from "./TLocationResponse"

export type TLocationResponseDto={
  locationResponse:TLocationResponse,
    locationResponseList:TLocationResponse[],
  message:string,
  httpStatus:number
}