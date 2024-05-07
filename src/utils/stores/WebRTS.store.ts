import { makeAutoObservable } from "mobx";
import { User } from "../../components/Connect/classes/User";
import { Messages, TMassageTypes } from "../../contexts/models/types/TSendCallback";

class WebRTCStore {
    users: User[] = [new User('')];
    name: string = "";

    constructor() {
        makeAutoObservable(this);

        fetch("https://randomuser.me/api/")
            .then((response) => response.json())
            .then((data) => {
                this.name = data.results[0].name.first;
            });
    }

    addUsers(user: User[]) {
        this.users = [...this.users, ...user];
    }

    sendMassageToAll(type: TMassageTypes, massage: Messages["data"]) {
        this.users.forEach((user) => {
            user.handleSendMassage(type, massage);
        });
    }
}

export default new WebRTCStore();
