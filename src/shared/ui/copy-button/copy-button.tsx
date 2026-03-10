import { PropsWithChildren } from "react";
import { copyToClipboard } from "../../lib/copyToClipboard";

interface Props extends PropsWithChildren {
    text: string;
}

const CopyButton = ({ text, children }: Props) => {
    return (
        <button
            onClick={() => void copyToClipboard(text ? text + "\n" : "there`s no text")}
        >
            {children}
        </button>
    );
};

export default CopyButton;
