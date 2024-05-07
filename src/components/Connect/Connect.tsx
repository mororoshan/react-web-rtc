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

type ConnectionProps = {
    remoteDescription?: RTCSessionDescription;
    testKey: number;
    name: string;
    preparedUser: User;
    handleAddUsers: (names: string[]) => void;
};

const Connect = observer(
    ({
        remoteDescription,
        testKey,
        name,
        preparedUser,
        handleAddUsers,
    }: ConnectionProps) => {
        const [isPeerOnSameNetwork, setIsPeerOnSameNetwork] = useState(true);
        const [messageValue, setMessageValue] = useState("");
        const [thisConnectedUser, setThisConnectedUser] = useState("");
        const isConnected = useRef<boolean>(false);
        const usersInNet = useRef<number>();
        const user = useRef<User>(preparedUser);
        const handleSendOfferRef = useRef<() => Promise<void>>();
     
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
            const thisUser = store.users?.find(
                (u) => u.name === user.current.name
            );
            if (!thisUser || !thisUser.sendMassage) {
                return;
            }
            thisUser.sendMassage("connected-users", {
                userId: store.users
                    .map((user) => user.name)
                    .filter((e) => e !== ""),
            });
        };

        const handleSetLocalDescriptionForUser = () => {
            if (!user.current.name) return;
            console.log(
                "localDescription is set for",
                user.current.name,
                "offer: ",
                localDescription
            );

            store.users
                .find((user) => user.name === name)
                ?.setLocalDescription(localDescription);
        };

        const handleSendOffer = async () => {
            console.log("handleSendOffer called");

            const usersWithOffers = store.users.map((user) => ({
                userId: user.name,
                offer: JSON.stringify(user.localRTCSession),
            }));

            console.log("usersWithOffers:", usersWithOffers);

            sendMessage("sending-offers", usersWithOffers);
        };

        handleSendOfferRef.current = handleSendOffer;

        const handleAddUser = async () => {
            sendMessage("add-user", {
                name,
                usersInNet: store.users.filter((user) => user.name !== "")
                    .length,
            });
        };

        useEffect(() => {            
            if (connectionState && connectionState === "connected") {
                user.current.setSendMassage(sendMessage as TSendCallback);
                setTimeout(() => {
                    console.log("Connected to peer");
                    handleAddUser().then(() => {
                        if (store.users.length === 1) {
                            console.log("what", store.users.find(storeUser => storeUser.randomKey === user.current.randomKey))

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
                    console.log("Received add-user:", message.data);
                    setThisConnectedUser(message.data.name);
                    if (user?.current) {
                        user.current.setName(message.data.name);
                        store.users
                            ?.find((e) => e.name === "")
                            ?.setName(message.data.name);
                        usersInNet.current = message.data.usersInNet;
                    }
                }
            );

            const unregisterAskForUsers = registerEventHandler(
                "ask-for-users",
                (message) => {
                    console.log("Received ask-for-users:", message.data);
                    handleCheckForUsers();
                }
            );

            const unregisterSendingOffers = registerEventHandler(
                "sending-offers",
                (message) => {
                    console.log("received sending offers", message);
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
            };
        }, [registerEventHandler]);

        return (
            <div>
                <ul>
                    {store.users.map((user) => {
                        return <li key={user.name}>
                            <div>user.name: {user.name}</div>
                            <div>user.offer: {user.localRTCSession?"Its there trust me": "nope"}</div>
                        </li>;
                    })}
                </ul>
                {user?.current?.name && <h1>{user.current.name}</h1>}
                {/* <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <QRCode value={localDescription} size={256} />
                </div> */}

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
