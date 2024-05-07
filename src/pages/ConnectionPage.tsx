import { Fragment, ReactElement, useEffect, useState } from "react";
import Connect from "../components/Connect/Connect";
import { observer } from "mobx-react-lite";
import store from "../utils/stores/WebRTS.store";
import { User } from "../components/Connect/classes/User";

type Props = {};

const ConnectionPage = observer((props: Props) => {
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
        <>
            <h1>MY NAME IS {store.name}</h1>
            <section>
                {store.users.map((user, i) => (
                    <Fragment key={user.randomKey}>
                        <Connect
                            testKey={0}
                            name={store.name}
                            preparedUser={user}
                            handleAddUsers={handleAddUser}
                        />
                    </Fragment>
                ))}
            </section>
            <button onClick={() => handleAddUser()}>+</button>
            {store.users.length > 0 && (
                <button
                    onClick={() =>
                        store.sendMassageToAll("text-message", {
                            from: "nice cock",
                            value: "awesome balls",
                        })
                    }
                >
                    Send Json Data
                </button>
            )}
        </>
    );
});

export default ConnectionPage;
