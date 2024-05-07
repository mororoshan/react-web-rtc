const CopyLocalDescription = ({
    isLoading,
    localDescription,
}: {
    isLoading: boolean;
    localDescription: string | undefined;
}) => {
    return (
        <div>
            <button
                disabled={isLoading}
                onClick={() => {
                    !isLoading &&
                        localDescription &&
                        navigator.clipboard.writeText(localDescription);
                }}
            >
                Copy local description
            </button>
        </div>
    );
};

export default CopyLocalDescription;
