import { action, makeAutoObservable, observable } from "mobx";
import {
    TMassageTypes,
    Messages,
} from "../../../contexts/models/types/TSendCallback";
import { User } from "../classes/User";
import { createContext, useContext } from "react";
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
                        "X-Api-Key": "Qo08F1iksni87sPN9lzzflYbZi6bRgTF4bz1VLol",
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

    sendMassageToAll(type: TMassageTypes, massage: Messages["data"]) {
        this.users.forEach((user) => {
            user.handleSendMassage(type, massage);
        });
    }

    addChatMessage(me: boolean, from: string, message: string) {
        this.messages.push({ me, from, message });
    }

    private setName = action((name: string) => {
        this.name = name;
    });
}

const WebRTCStoreContext = createContext<WebRTCStore>(new WebRTCStore());
export const useWebRTCStore = (): WebRTCStore => useContext(WebRTCStoreContext);
