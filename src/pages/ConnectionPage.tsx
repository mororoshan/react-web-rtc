import { Fragment, useEffect } from "react";
import Connect from "../components/Connect/Connect";
import { observer } from "mobx-react-lite";
import { User } from "../components/Connect/classes/User";
import Button from "../shared/ui/Button/Button";
import Chat from "../components/Chat/Chat";
import { useWebRTCStore } from "../components/Connect/stores/webrtc.store";

type Props = {};

const ConnectionPage = observer((props: Props) => {
    const store = useWebRTCStore();

    useEffect(() => {
        if (!store.name) {
            store.fetchRandomName();
        }
    }, []);

    if (!store.name) {
        return <div>Loading</div>;
    }

    const handleAddUser = (names?: string[]) => {
        if (!names) {
            store.addUsers([new User("")]);
        } else {
            store.addUsers([...names.map((name) => new User(name))]);
        }
    };

    return (
        <div className="bg-gray-700 p-6 mx-4">
            <h1>MY NAME IS {store.name}</h1>
            <section className="flex flex-wrap gap-8">
                {store.usersArray.map((user) => (
                    <Connect
                        key={user.randomKey}
                        testKey={0}
                        name={store.name}
                        user={user}
                        handleAddUsers={handleAddUser}
                    />
                ))}
                <div className="flex justify-center items-center">
                    <Button
                        className="w-12 h-12"
                        onClick={() => handleAddUser()}
                    >
                        +
                    </Button>
                </div>
            </section>
            <div className="flex justify-center w-full">
                <div className="w-1/3">
                    <Chat />
                </div>
            </div>
        </div>
    );
});

export default ConnectionPage;
