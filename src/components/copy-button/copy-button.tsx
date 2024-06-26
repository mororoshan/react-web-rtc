import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    text: string;
}

const CopyButton = ({ text, children }: Props) => {
    const unsecuredCopyToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("Unable to copy to clipboard", err);
        }
        document.body.removeChild(textArea);
    };

    /**
     * Copies the text passed as param to the system clipboard
     * Check if using HTTPS and navigator.clipboard is available
     * Then uses standard clipboard API, otherwise uses fallback
     */
    const copyToClipboard = (content: string) => {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(content);
        } else {
            unsecuredCopyToClipboard(content);
        }
    };

    return (
        <button
            onClick={() =>
                copyToClipboard(text + "\n" || "there`s no text")
            }
        >
            {children}
        </button>
    );
};

export default CopyButton;
