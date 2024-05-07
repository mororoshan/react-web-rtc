import {
    Messages,
    TMassageTypes,
    TSendCallback,
} from "../../../contexts/models/types/TSendCallback";

export class User {
    public name: string;
    public randomKey: number;
    public localRTCSession: string;
    public remoteRTCSession?: string;
    public sendMassage?: TSendCallback | null;

    public setRemoteDescription?: (
        remoteDescriptionString: string
    ) => Promise<void>;

    constructor(name: string) {
        this.name = name;
        this.localRTCSession = "";
        this.randomKey = Math.random();
    }

    setLocalDescription(localDescriptionString: string) {
        this.localRTCSession = localDescriptionString;
    }

    setRemoteDescriptionFn(
        fn: (remoteDescriptionString: string) => Promise<void>
    ) {
        this.setRemoteDescription = fn;
    }

    setSendMassage(fn: TSendCallback) {
        this.sendMassage = fn;
    }

    setName(name: string) {
        this.name = name;
    }

    handleSendMassage(massage: TMassageTypes, data: Messages["data"]) {
        if (!this.sendMassage) return;
        this.sendMassage(massage, data);
    }
}
