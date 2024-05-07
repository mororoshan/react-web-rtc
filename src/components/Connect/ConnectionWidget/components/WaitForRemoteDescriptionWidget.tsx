import { RemoteDescriptionInput } from "./RemoteDescriptionInput";
import { ServerlessWebRTC } from "../ConnectionWidget";

export const WaitForRemoteDescriptionWidget = ({
  setRemoteDescription,
}: {
  setRemoteDescription: ServerlessWebRTC["setRemoteDescription"];
}) => (
  <div>
    <p>
      Now get your friend to send you their local description. Paste it into the
      connect box and press connect.
    </p>
    <RemoteDescriptionInput setRemoteDescription={setRemoteDescription} />
  </div>
);

export default WaitForRemoteDescriptionWidget;