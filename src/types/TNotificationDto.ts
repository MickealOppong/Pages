import type { TNotificationMsgDto } from "./TNotificationMsgDto";

export type TNotificationDto={
    totalCount:number,
    notif:{
        [notificationType: string]: number;
    },
    msg:TNotificationMsgDto[]
}