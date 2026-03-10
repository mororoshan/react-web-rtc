import { action, makeAutoObservable, observable } from "mobx";
import {
    TMessageTypes,
    Messages,
} from "../../../contexts/models/types/TSendCallback";
import { User } from "../classes/User";
import { createContext, useContext, type ReactNode, createElement } from "react";
import axios from "axios";

class WebRTCStore {
    users: User[] = observable([new User("")]);
    name: string = "";
    messages: { me: boolean; from: string; message: string }[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async fetchRandomName() {
        try {
            const { data, status } = await axios.get<{ username: string }[]>(
                "https://api.api-ninjas.com/v2/randomuser?count=1",
                {
                    headers: {
                        "X-Api-Key": import.meta.env.VITE_NAME_KEY,
                    },
                },
            );
            console.log(data);
            this.setName(data[0].username);
        } catch (error) {}
    }

    get usersArray() {
        return this.users;
    }

    addUsers(user: User[]) {
        this.users = [...this.users, ...user];
    }

    sendMessageToAll(type: TMessageTypes, message: Messages["data"]) {
        this.users.forEach((user) => {
            user.handleSendMessage(type, message);
        });
    }

    addChatMessage(me: boolean, from: string, message: string) {
        this.messages.push({ me, from, message });
    }

    private setName = action((name: string) => {
        this.name = name;
    });
}

const WebRTCStoreContext = createContext<WebRTCStore | null>(null);

export const useWebRTCStore = (): WebRTCStore => {
    const store = useContext(WebRTCStoreContext);
    if (!store) {
        throw new Error("useWebRTCStore must be used within WebRTCStoreProvider");
    }
    return store;
};

export function WebRTCStoreProvider({
    children,
    store = new WebRTCStore(),
}: {
    children: ReactNode;
    store?: WebRTCStore;
}) {
    return createElement(
        WebRTCStoreContext.Provider,
        { value: store },
        children,
    );
}
