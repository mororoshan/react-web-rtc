import { useState } from "react";
import { MagnifyingGlass } from "../../shared/ui/MagnifyingGlass";
import { GlassPanel } from "../../shared/ui/GlassPanel";
import { Badge } from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button/Button";
import ButtonGlass from "../../shared/ui/ButtonGlass/ButtonGlass";
import CopyButton from "../../shared/ui/copy-button/copy-button";
import { ErrorBoundary } from "../../shared/ui/ErrorBoundary/ErrorBoundary";
import useDraggable from "../../shared/lib/hooks/useDraggable";

const ThrowError = () => {
    const [shouldThrow, setShouldThrow] = useState(false);
    if (shouldThrow) throw new Error("Demo error for ErrorBoundary");
    return (
        <button
            type="button"
            onClick={() => setShouldThrow(true)}
            className="rounded bg-rose-600/20 px-3 py-1.5 text-sm text-rose-200 hover:bg-rose-600/40"
        >
            Trigger error
        </button>
    );
};

const UiShowcasePage = () => {
    const { bind } = useDraggable();

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-100">
            <div className="mx-auto max-w-4xl px-6 py-12">
                <header className="mb-16 text-center">
                    <h1 className="font-bold tracking-tight text-4xl text-white md:text-5xl">
                        UI Library Showcase
                    </h1>
                    <p className="mt-3 text-gray-400 text-lg">
                        A small set of components including liquid-glass effects
                    </p>
                </header>

                {/* 1. Magnifying Glass (liquid glass) */}
                <section className="mb-20">
                    <h2 className="mb-2 font-semibold text-amber-400 text-sm uppercase tracking-wider">
                        Liquid Glass
                    </h2>
                    <h3 className="mb-4 font-semibold text-xl text-white">
                        Magnifying Glass
                    </h3>
                    <p className="mb-6 max-w-xl text-gray-400 text-sm">
                        Drag the magnifying glass over the grid. The lens uses{" "}
                        <code className="rounded bg-gray-700 px-1 py-0.5 text-amber-200">
                            GlassElement
                        </code>{" "}
                        for refraction and chromatic aberration.
                    </p>
                    <div className="relative h-72 w-full overflow-hidden rounded-xl bg-dark-grid">
                        <div className="flex h-full w-full items-center justify-center text-gray-500 text-sm">
                            <span className="rounded bg-gray-800/80 px-4 py-2 font-mono text-xs">
                                Drag the lens over this area
                            </span>
                        </div>
                        <div
                            {...bind}
                            style={bind.style}
                            className="z-10 w-fit touch-none"
                        >
                            <MagnifyingGlass
                                size={120}
                                depth={45}
                                strength={-20}
                                chromaticAberration={1}
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Glass Panel */}
                <section className="mb-20">
                    <h2 className="mb-2 font-semibold text-amber-400 text-sm uppercase tracking-wider">
                        Glass Panel
                    </h2>
                    <h3 className="mb-4 font-semibold text-xl text-white">
                        Card with refraction
                    </h3>
                    <p className="mb-6 max-w-xl text-gray-400 text-sm">
                        A rectangular glass panel for cards and overlays.
                    </p>
                    <div className="rounded-xl bg-dark-grid p-8" style={{ backgroundSize: "32px 32px" }}>
                        <GlassPanel
                            width={280}
                            height={140}
                            radius={16}
                            depth={10}
                            contentBg="rgba(255,255,255,0.08)"
                        >
                            <div className="flex flex-col items-center gap-2 p-4">
                                <span className="font-medium text-white">GlassPanel</span>
                                <span className="text-gray-400 text-sm">Liquid glass rectangle</span>
                            </div>
                        </GlassPanel>
                    </div>
                </section>

                {/* 3. Badges */}
                <section className="mb-20">
                    <h2 className="mb-2 font-semibold text-amber-400 text-sm uppercase tracking-wider">
                        Badges
                    </h2>
                    <h3 className="mb-4 font-semibold text-xl text-white">
                        Status & tags
                    </h3>
                    <p className="mb-6 max-w-xl text-gray-400 text-sm">
                        Small pills for status, tags, and labels.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="danger">Danger</Badge>
                        <Badge variant="info">Info</Badge>
                    </div>
                </section>

                {/* 4. Buttons */}
                <section className="mb-20">
                    <h2 className="mb-2 font-semibold text-amber-400 text-sm uppercase tracking-wider">
                        Buttons
                    </h2>
                    <h3 className="mb-4 font-semibold text-xl text-white">
                        Standard & glass
                    </h3>
                    <p className="mb-6 max-w-xl text-gray-400 text-sm">
                        Standard button and liquid-glass button.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button>Primary</Button>
                        <div className="rounded-lg bg-dark-grid p-4" style={{ backgroundSize: "20px 20px" }}>
                            <ButtonGlass
                                width={100}
                                height={44}
                                radius={8}
                                depth={15}
                                strength={20}
                                chromaticAberration={1}
                            >
                                Glass Button
                            </ButtonGlass>
                        </div>
                    </div>
                </section>

                {/* 5. Copy button */}
                <section className="mb-20">
                    <h2 className="mb-2 font-semibold text-amber-400 text-sm uppercase tracking-wider">
                        Copy to clipboard
                    </h2>
                    <h3 className="mb-4 font-semibold text-xl text-white">
                        CopyButton
                    </h3>
                    <p className="mb-6 max-w-xl text-gray-400 text-sm">
                        Copies text to the clipboard. Click to copy the snippet below.
                    </p>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                        <code className="flex-1 font-mono text-gray-300 text-sm">
                            const glass = &lt;GlassElement depth=&#123;40&#125; /&gt;
                        </code>
                        <CopyButton text="const glass = <GlassElement depth={40} />">
                            <Button type="button">Copy</Button>
                        </CopyButton>
                    </div>
                </section>

                {/* 6. Error boundary */}
                <section className="mb-20">
                    <h2 className="mb-2 font-semibold text-amber-400 text-sm uppercase tracking-wider">
                        Error handling
                    </h2>
                    <h3 className="mb-4 font-semibold text-xl text-white">
                        ErrorBoundary
                    </h3>
                    <p className="mb-6 max-w-xl text-gray-400 text-sm">
                        Catches React errors and shows a fallback. Click to trigger.
                    </p>
                    <ErrorBoundary>
                        <ThrowError />
                    </ErrorBoundary>
                </section>
            </div>
        </div>
    );
};

export default UiShowcasePage;
