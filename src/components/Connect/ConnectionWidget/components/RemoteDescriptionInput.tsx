import { useState } from "react";
import { ServerlessWebRTC } from "../ConnectionWidget";

export const RemoteDescriptionInput = ({
  setRemoteDescription,
}: {
  setRemoteDescription: ServerlessWebRTC["setRemoteDescription"];
}) => {
  const [remoteDescriptionString, setRemoteDescriptionString] = useState("");
  return (
    <div>
      <input
        value={remoteDescriptionString}
        onChange={(e) => {
          setRemoteDescriptionString(e.target.value);
        }} />
      <button
        onClick={() => {
          if (!remoteDescriptionString) return;

          setRemoteDescription(remoteDescriptionString);
        }}
      >
        Connect
      </button>
    </div>
  );
};

export default RemoteDescriptionInput;
