import { ConnectionWidget } from "./ConnectionWidget/ConnectionWidget";
import { User } from "./classes/User";
import { observer } from "mobx-react-lite";
import { useConnect } from "./hooks/useConnect";

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
        const {
            connectionState,
            isLocalDescriptionReady,
            localDescription,
            setRemoteDescription,
        } = useConnect({
            name,
            user,
            handleAddUsers,
        });

        return (
            <div className="p-4 bg-gray-600 rounded flex flex-col justify-center">
                {user.name && (
                    <div className="flex gap-2 items-center">
                        <h1 className="font-bold text-3xl">{user.name}</h1>
                        <div
                            className={`${
                                connectionState === "connected"
                                    ? "bg-green-600"
                                    : "bg-orange-600"
                            } rounded-full w-2 aspect-square `}
                        ></div>
                    </div>
                )}

                {(connectionState === "initial" ||
                    connectionState === "needToSendLocalDescription" ||
                    connectionState === "waitingForRemoteDescription") && (
                    <ConnectionWidget
                        connectionState={connectionState}
                        isLoading={isLocalDescriptionReady}
                        localDescription={localDescription}
                        setRemoteDescription={setRemoteDescription}
                    />
                )}
            </div>
        );
    },
);

export default Connect;
