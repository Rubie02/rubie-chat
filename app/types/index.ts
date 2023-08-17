import { Conversation, Message, User } from "@prisma/client";

export type FullMesssageType = Message & {
    sender: User,
    seen: User[]
};

export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMesssageType[],
};