import type { TPostList } from "./TPostList"

export type TResponseDto={
    message:string,
    httpStatus:number,
    data:TPostList[]
}