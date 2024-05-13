import { useRef, useState } from "react";
import { ServerlessWebRTC } from "../ConnectionWidget";
import { useForm } from "react-hook-form";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";

export const RemoteDescriptionInput = ({
    setRemoteDescription,
}: {
    setRemoteDescription: ServerlessWebRTC["setRemoteDescription"];
}) => {
    const { register, getValues } = useForm<{ remoteDescription: string }>({
        mode: "onChange",
    });

    return (
        <div>
            <Input {...register("remoteDescription")} />
            <Button
                onClick={() => {
                    if (!getValues("remoteDescription")) return;

                    setRemoteDescription(getValues("remoteDescription"));
                }}
            >
                Connect
            </Button>
        </div>
    );
};

export default RemoteDescriptionInput;
