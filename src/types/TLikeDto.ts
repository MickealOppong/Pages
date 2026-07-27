import type { TLikes } from "./TLikes"

export type TLikeDto={
    message:string,
    httpStatus:number,
    data:TLikes[]
}