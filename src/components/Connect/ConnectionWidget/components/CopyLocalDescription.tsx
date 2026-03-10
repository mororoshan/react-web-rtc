import Button from "../../../../shared/ui/Button/Button";
import { copyToClipboard } from "../../../../shared/lib/copyToClipboard";

const CopyLocalDescription = ({
    isLoading,
    localDescription,
}: {
    isLoading: boolean;
    localDescription: string | undefined;
}) => {
    return (
        <div>
            <Button
                className="w-full"
                disabled={isLoading}
                onClick={() => {
                    if (!isLoading && localDescription) {
                        void copyToClipboard(localDescription);
                    }
                }}
            >
                Copy local description
            </Button>
        </div>
    );
};

export default CopyLocalDescription;
