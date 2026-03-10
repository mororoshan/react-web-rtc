/**
 * Copies text to the system clipboard.
 * Uses navigator.clipboard in secure contexts, falls back to document.execCommand otherwise.
 * @returns Promise that resolves to true if copy succeeded, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            return false;
        }
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const ok = document.execCommand("copy");
        document.body.removeChild(textArea);
        return ok;
    } catch {
        document.body.removeChild(textArea);
        return false;
    }
}
