import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

type State = {
    hasError: boolean;
    error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div
                        className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded bg-red-950/20 p-4 text-red-200"
                        role="alert"
                    >
                        <h2 className="text-lg font-semibold">
                            Something went wrong
                        </h2>
                        <p className="text-sm">
                            {this.state.error?.message ?? "An unexpected error occurred."}
                        </p>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}
