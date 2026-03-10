import { BaseMessage, FindByType } from "../../../utils/hooks/ServerlessWebRTC";

export enum MessageType {
    TEXT_MESSAGE = "text-message",
    PING = "ping",
    SEND_JSON_DATA = "send-json-data",
    ADD_USER = "add-user",
    CONNECTED_USERS = "connected-users",
    CREATE_NEW_CONNECTION = "create-new-connection",
    SENDING_ANSWER_OFFER = "sending-answer-offer",
    SENDING_OFFERS = "sending-offers",
    SENDING_ANSWERS = "sending-answers",
    ASK_FOR_USERS = "ask-for-users",
    SENDING_OFFER_FROM_NEW = "sending-offer-from-new",
    RECEIVE_ANSWER_OFFER = "receive-answer-offer",
}

export type TSendCallback = <T extends TMessageTypes>(
    messageType: T,
    data: Messages["data"],
) => void;

export type Messages =
    | TextMessage
    | PingMessage
    | JSONDataMessage
    | AddUserMessage
    | ConnectedUsersMessage
    | CreateNewConnectionMessage
    | SendingAnswerOfferMessage
    | SendingOffersMessage
    | SendingAnswersMessage
    | AskForUsersMessage
    | SendNewPersonOfferPersonMessage
    | SendReceiveAnswerOfferMessage;

export type TMessageTypes =
    | MessageType.TEXT_MESSAGE
    | MessageType.PING
    | MessageType.SEND_JSON_DATA
    | MessageType.ADD_USER
    | MessageType.CONNECTED_USERS
    | MessageType.CREATE_NEW_CONNECTION
    | MessageType.SENDING_ANSWER_OFFER
    | MessageType.SENDING_OFFERS
    | MessageType.SENDING_ANSWERS
    | MessageType.ASK_FOR_USERS
    | MessageType.SENDING_OFFER_FROM_NEW
    | MessageType.RECEIVE_ANSWER_OFFER;

export type TextMessage = BaseMessage<
    MessageType.TEXT_MESSAGE,
    { value: string; from: string }
>;
export type PingMessage = BaseMessage<MessageType.PING>;

export type JSONDataMessage = BaseMessage<
    MessageType.SEND_JSON_DATA,
    { data: string; from: string }
>;

export type AddUserMessage = BaseMessage<
    MessageType.ADD_USER,
    { name: string; usersInNet: number }
>;
export type RemoveUserMessage = BaseMessage<"remove-user", { name: string }>;
export type SendReplyOfferMessage = BaseMessage<
    "sending-reply-offer-user",
    { name: string }
>;

export type AskForUsersMessage = BaseMessage<MessageType.ASK_FOR_USERS, undefined>;

export type ConnectedUsersMessage = BaseMessage<
    MessageType.CONNECTED_USERS,
    { userId: string[] }
>;

export type CreateNewConnectionMessage = BaseMessage<
    "creating-new-connection",
    { userId: string; offer: string }[]
>;

export type SendingAnswerOfferMessage = BaseMessage<
    MessageType.SENDING_ANSWER_OFFER,
    { to: string; userId: string; offer: string }
>;

export type SendingOffersMessage = BaseMessage<
    MessageType.SENDING_OFFERS,
    { userId: string; offer: string | undefined }[]
>;

export type SendingAnswersMessage = BaseMessage<
    MessageType.SENDING_ANSWERS,
    { data: { userId: string; answer: string | undefined }[] }
>;

export type SendNewPersonOfferPersonMessage = BaseMessage<
    MessageType.SENDING_OFFER_FROM_NEW,
    { userId: string; offer: string }
>;

export type SendReceiveAnswerOfferMessage = BaseMessage<
    MessageType.RECEIVE_ANSWER_OFFER,
    {
        userId: string;
        answer: string;
    }
>;
