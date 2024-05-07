import { useEffect, useRef, useState } from "react";
import { useServerlessWebRTC } from "../../utils/hooks/ServerlessWebRTC";
import { ConnectionWidget } from "./ConnectionWidget/ConnectionWidget";
import {
    TextMessage,
    Messages,
    TSendCallback,
} from "../../contexts/models/types/TSendCallback";
import { User } from "./classes/User";
import store from "../../utils/stores/WebRTS.store";
import { observer } from "mobx-react-lite";
import QRCode from "qrcode.react";
import { send } from "process";

type ConnectionProps = {
    remoteDescription?: RTCSessionDescription;
    testKey: number;
    name: string;
    user: User;
    handleAddUsers: (names: string[]) => void;
};

const Connect = observer(
    ({
        remoteDescription,
        testKey,
        name,
        user,
        handleAddUsers,
    }: ConnectionProps) => {
        const [isPeerOnSameNetwork, setIsPeerOnSameNetwork] = useState(true);
        const [messageValue, setMessageValue] = useState("");
        const [thisConnectedUser, setThisConnectedUser] = useState("");
        const isConnected = useRef<boolean>(false);
        const usersInNet = useRef<number>();
        const handleSendOfferRef = useRef<() => void>();
        const handleReceiveAnswerOfferFnRef =
            useRef<(User: User, from: string, offer: string) => void>();
        const handledAnswerOfferFnRef =
            useRef<(to: string, ld: string) => void>();
        const handleNewPersonFnRef =
            useRef<(User: User, offer: string) => void>();

        const [messages, setMessages] = useState<
            { from: string; value: string }[]
        >([]);

        const addMessage = (newMessage: TextMessage["data"]) => {
            setMessages((prev) => [...prev, newMessage]);
        };

        const {
            localDescription,
            setRemoteDescription,
            sendMessage,
            registerEventHandler,
            connectionState,
            isLocalDescriptionReady,
            remoteDescriptionString,
        } = useServerlessWebRTC<Messages["type"], Messages>({
            useIceServer: !isPeerOnSameNetwork,
        });

        const askForUsersInNet = async () => {
            sendMessage("ask-for-users", undefined);
        };

        const handleCheckForUsers = async () => {
            const thisUser = store.users?.find((u) => u.name === user.name);
            if (!thisUser || !thisUser.sendMessage) {
                return;
            }
            thisUser.sendMessage("connected-users", {
                userId: store.users
                    .map((user) => user.name)
                    .filter((e) => e !== ""),
            });
        };

        const handleSetLocalDescriptionForUser = (ld: string) => {
            user.setLocalDescription(ld);
        };

        const getUsersFromStore = () => {
            return store.usersArray.map((user) => ({
                userId: user.name,
                offer: JSON.stringify(user.localRTCSession),
            }));
        };

        const handleSendOfferToUser = (u: User, offer: string) => {
            if (u.sendMessage) {
                u.sendMessage("sending-offer-from-new", {
                    userId: user.name,
                    offer: offer,
                });
            }
        };

        const handleSendOffer = async () => {
            let usersFromStore: ReturnType<typeof getUsersFromStore>;
            setTimeout(() => {
                usersFromStore = getUsersFromStore();
                console.log("usersWithOffers:", usersFromStore);
                sendMessage("sending-offers", usersFromStore);
            }, 500);
        };

        const sendAnswerOffer = async (to: string, ld: string) => {
            setTimeout(() => {
                console.log("send answer offer", localDescription);
                sendMessage("sending-answer-offer", {
                    to,
                    userId: name,
                    offer: store.users.find((u) => u.name === to)?.localRTCSession || '',
                });
            }, 3500);
        };

        const handleReceiveAnswerOffer = async (
            u: User,
            from: string,
            answer: string
        ) => {
            if (u.sendMessage) {
                u.sendMessage("receive-answer-offer", { userId: from, answer });
            }
        };

        handledAnswerOfferFnRef.current = sendAnswerOffer;
        handleSendOfferRef.current = handleSendOffer;
        handleNewPersonFnRef.current = handleSendOfferToUser;
        handleReceiveAnswerOfferFnRef.current = handleReceiveAnswerOffer;

        const handleAddUser = async () => {
            sendMessage("add-user", {
                name,
                usersInNet: store.users.filter((user) => user.name !== "")
                    .length,
            });
        };

        useEffect(() => {
            if (!localDescription) return;
            handleSetLocalDescriptionForUser(localDescription);
            user.setRemoteDescription = setRemoteDescription;
        }, [isLocalDescriptionReady]);

        useEffect(() => {
            if (connectionState && connectionState === "connected") {
                user.setSendMassage(sendMessage as TSendCallback);
                setTimeout(() => {
                    console.log("Connected to peer");
                    handleAddUser().then(() => {
                        if (store.users.length === 1) {
                            askForUsersInNet();
                        }
                    });
                }, 100);
            }
        }, [connectionState]);

        useEffect(() => {
            const unregisterSendInfoAboutOtherUsers = registerEventHandler(
                "connected-users",
                (message) => {
                    console.log("received connected-users", message);

                    console.log(usersInNet.current, store.users.length);

                    handleAddUsers(
                        message.data.userId.filter((e) => e !== name)
                    );
                    isConnected.current = true;
                    if (handleSendOfferRef?.current)
                        handleSendOfferRef.current();
                }
            );

            const unregisterTextMessage = registerEventHandler(
                "text-message",
                (message) => {
                    console.log("Received text-message:", message.data);
                    addMessage(message.data);
                }
            );

            const unregisterPingMessage = registerEventHandler("ping", () => {
                console.log("Received ping-message.");
            });

            const unregisterSendJsonData = registerEventHandler(
                "send-json-data",
                (message) => {
                    console.log("Received send-json-data:", message.data);
                }
            );

            const unregisterAddUser = registerEventHandler(
                "add-user",
                (message) => {
                    if (user) {
                        user.setName(message.data.name);
                        usersInNet.current = message.data.usersInNet;
                    }
                }
            );

            const unregisterAskForUsers = registerEventHandler(
                "ask-for-users",
                (message) => {
                    handleCheckForUsers();
                }
            );

            const unregisterSendingOffers = registerEventHandler(
                "sending-offers",
                (message) => {
                    console.log("received sending offers", message);
                    message.data.forEach((offer) => {
                        const u = store.users.find(
                            (user) => user.name === offer.userId
                        );
                        if (handleNewPersonFnRef?.current && u && offer.offer)
                            handleNewPersonFnRef?.current(u, offer.offer);
                    });
                }
            );

            const unregisterSendOfferFromNew = registerEventHandler(
                "sending-offer-from-new",
                (message) => {
                    handleAddUsers([message.data.userId]);
                    const u = store.users.find(
                        (user) => user.name === message.data.userId
                    );

                    setTimeout(() => {
                        if (u && u.setRemoteDescription) {
                            u.remoteRTCSession = message.data.offer;
                            u.setRemoteDescription(
                                JSON.parse(message.data.offer)
                            );
                        }
                    }, 500);

                    console.log(u?.localRTCSession)
                    setTimeout(() => {
                        if (handledAnswerOfferFnRef?.current && u)
                            handledAnswerOfferFnRef?.current(
                                message.data.userId,
                                u.localRTCSession
                            );
                    }, 500);
                }
            );

            const unregisterSendAnswerOffer = registerEventHandler(
                "sending-answer-offer",
                (message) => {
                    console.log("received sending answer offer", message);
                    const us = store.users.find(
                        (u) => u.name === message.data.to
                    );
                    setTimeout(() => {
                        if (
                            us &&
                            us.sendMessage &&
                            handleReceiveAnswerOfferFnRef.current
                        ) {
                            handleReceiveAnswerOfferFnRef.current(
                                us,
                                message.data.userId,
                                message.data.offer
                            );
                        }
                    }, 1000);
                }
            );

            const unregisterAskForUsersInNet = registerEventHandler(
                "receive-answer-offer",
                (message) => {
                    console.log("received receive-answer-offer", message);
                    const us = store.users.find(
                        (u) => u.name === message.data.userId
                    );
                    if (us && us.setRemoteDescription) {
                        us.remoteRTCSession = message.data.answer;
                        us.setRemoteDescription(message.data.answer);
                    }
                }
            );

            return () => {
                unregisterTextMessage();
                unregisterPingMessage();
                unregisterSendJsonData();
                unregisterAddUser();
                unregisterSendInfoAboutOtherUsers();
                unregisterAskForUsers();
                unregisterSendingOffers();
                unregisterSendOfferFromNew();
                unregisterSendAnswerOffer();
                unregisterAskForUsersInNet();
            };
        }, [registerEventHandler]);

        return (
            <div>
                {user.name && <h1>{user.name}</h1>}
                <button
                    onClick={() => {
                        store.users[0].name = store.users[0].name + "1";
                    }}
                >
                    XXXX
                </button>

                <ConnectionWidget
                    connectionState={connectionState}
                    isLoading={isLocalDescriptionReady}
                    localDescription={localDescription}
                    setRemoteDescription={setRemoteDescription}
                />

                <div>
                    <input
                        value={messageValue}
                        onChange={(e) => {
                            setMessageValue(e.target.value);
                        }}
                    />
                    <button
                        onClick={() => {
                            const message = { value: messageValue, from: name };
                            sendMessage("text-message", message);
                            addMessage(message);
                            setMessageValue("");
                        }}
                    >
                        Send Text Message
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => {
                            sendMessage("ping", undefined);
                        }}
                    >
                        Send Ping Message
                    </button>
                </div>
                <div>
                    <p>Messages</p>
                    <ul>
                        {messages.map((message, index) => (
                            <li key={index}>
                                {message.from}: {message.value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
);

export default Connect;
