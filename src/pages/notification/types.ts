export type NotificationProps = {
    id?: string;
    message: string;
    chatId?: string;
    read?: boolean;
    sender: string;
    senderEmail: string;
    type: "success" | "error" | "info";
    createdAt: number;
    isUnread?: boolean;
    map?: string;
    otherUserName: string;
  }