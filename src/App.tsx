import { AppRouter } from "./app/providers/router";
import { WebRTCStoreProvider } from "./components/Connect/stores/webrtc.store";

const App = () => {
    return (
        <WebRTCStoreProvider>
            <AppRouter />
        </WebRTCStoreProvider>
    );
};

export default App;
