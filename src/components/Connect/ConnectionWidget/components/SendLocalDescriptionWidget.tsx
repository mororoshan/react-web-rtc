import CopyLocalDescription from "./CopyLocalDescription";

export const SendLocalDescriptionWidget = ({
  isLoading, localDescription,
}: {
  isLoading: boolean;
  localDescription: string | undefined;
}) => (
  <div>
    <p>Now copy your local description and send it to your friend.</p>
    <CopyLocalDescription
      isLoading={isLoading}
      localDescription={localDescription} />
  </div>
);

export default SendLocalDescriptionWidget;