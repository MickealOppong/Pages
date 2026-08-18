import type { TLocationResponse } from "./TLocationResponse"
import type { TPostList } from "./TPostList"

export type TResponseDto={
    message:string,
    httpStatus:number,
    data:TPostList[]|TLocationResponse
}