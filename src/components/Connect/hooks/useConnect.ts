import { useEffect, useRef, useState } from "react";
import { useServerlessWebRTC } from "../../../utils/hooks/ServerlessWebRTC";
import {
    Messages,
    TSendCallback,
} from "../../../contexts/models/types/TSendCallback";
import { User } from "../classes/User";
import { useWebRTCStore } from "../stores/webrtc.store";

type UseConnectParams = {
    name: string;
    user: User;
    handleAddUsers: (names: string[]) => void;
};

export const useConnect = ({
    name,
    user,
    handleAddUsers,
}: UseConnectParams) => {
    const [isPeerOnSameNetwork, setIsPeerOnSameNetwork] = useState(true);
    const store = useWebRTCStore();
    const isConnected = useRef<boolean>(false);
    const usersInNet = useRef<number>();
    const handleSendOfferRef = useRef<() => void>();
    const handleReceiveAnswerOfferFnRef =
        useRef<(user: User, from: string, offer: string) => void>();
    const handledAnswerOfferFnRef = useRef<(to: string, ld: string) => void>();
    const handleNewPersonFnRef = useRef<(user: User, offer: string) => void>();

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
            sendMessage("sending-offers", usersFromStore);
        }, 500);
    };

    const sendAnswerOffer = async (to: string, ld: string) => {
        setTimeout(() => {
            sendMessage("sending-answer-offer", {
                to,
                userId: name,
                offer:
                    store.users.find((u) => u.name === to)?.localRTCSession ||
                    "",
            });
        }, 500);
    };

    const handleReceiveAnswerOffer = async (
        u: User,
        from: string,
        answer: string,
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
            usersInNet: store.users.filter((user) => user.name !== "").length,
        });
    };

    useEffect(() => {
        if (!localDescription) return;
        console.log(JSON.parse(localDescription).sdp);
        handleSetLocalDescriptionForUser(localDescription);
        user.setRemoteDescription = setRemoteDescription;
    }, [isLocalDescriptionReady]);

    useEffect(() => {
        if (connectionState && connectionState === "connected") {
            user.setSendMassage(sendMessage as TSendCallback);
            setTimeout(() => {
                handleAddUser().then(() => {
                    if (store.users.length === 1) {
                        askForUsersInNet();
                    }
                });
            }, 100);
        }

        if (connectionState === "disconnected") {
            store.users = store.users.filter(
                (u) => u.randomKey !== user.randomKey,
            );
        }
    }, [connectionState]);

    useEffect(() => {
        const unregisterSendInfoAboutOtherUsers = registerEventHandler(
            "connected-users",
            (message) => {
                handleAddUsers(message.data.userId.filter((e) => e !== name));
                isConnected.current = true;
                if (handleSendOfferRef?.current) handleSendOfferRef.current();
            },
        );

        const unregisterTextMessage = registerEventHandler(
            "text-message",
            (message) => {
                store.addChatMessage(
                    false,
                    message.data.from,
                    message.data.value,
                );
            },
        );

        const unregisterPingMessage = registerEventHandler("ping", () => {
            console.log("Received ping-message.");
        });

        const unregisterSendJsonData = registerEventHandler(
            "send-json-data",
            (message) => {
                console.log("Received send-json-data:", message.data);
            },
        );

        const unregisterAddUser = registerEventHandler(
            "add-user",
            (message) => {
                if (user) {
                    user.setName(message.data.name);
                    usersInNet.current = message.data.usersInNet;
                }
            },
        );

        const unregisterAskForUsers = registerEventHandler(
            "ask-for-users",
            () => {
                handleCheckForUsers();
            },
        );

        const unregisterSendingOffers = registerEventHandler(
            "sending-offers",
            (message) => {
                message.data.forEach((offer) => {
                    const u = store.users.find(
                        (user) => user.name === offer.userId,
                    );
                    if (handleNewPersonFnRef?.current && u && offer.offer)
                        handleNewPersonFnRef?.current(u, offer.offer);
                });
            },
        );

        const unregisterSendOfferFromNew = registerEventHandler(
            "sending-offer-from-new",
            (message) => {
                handleAddUsers([message.data.userId]);
                const u = store.users.find(
                    (user) => user.name === message.data.userId,
                );

                setTimeout(() => {
                    if (u && u.setRemoteDescription) {
                        u.remoteRTCSession = message.data.offer;
                        u.setRemoteDescription(JSON.parse(message.data.offer));
                    }
                }, 500);

                console.log(u?.localRTCSession);
                setTimeout(() => {
                    if (handledAnswerOfferFnRef?.current && u)
                        handledAnswerOfferFnRef?.current(
                            message.data.userId,
                            u.localRTCSession,
                        );
                }, 500);
            },
        );

        const unregisterSendAnswerOffer = registerEventHandler(
            "sending-answer-offer",
            (message) => {
                const us = store.users.find((u) => u.name === message.data.to);
                setTimeout(() => {
                    if (
                        us &&
                        us.sendMessage &&
                        handleReceiveAnswerOfferFnRef.current
                    ) {
                        handleReceiveAnswerOfferFnRef.current(
                            us,
                            message.data.userId,
                            message.data.offer,
                        );
                    }
                }, 1000);
            },
        );

        const unregisterAskForUsersInNet = registerEventHandler(
            "receive-answer-offer",
            (message) => {
                const us = store.users.find(
                    (u) => u.name === message.data.userId,
                );
                if (us && us.setRemoteDescription) {
                    us.remoteRTCSession = message.data.answer;
                    us.setRemoteDescription(message.data.answer);
                }
            },
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

    return {
        connectionState,
        isLocalDescriptionReady,
        localDescription,
        setRemoteDescription,
    };
};
