import { useState } from "react";

import GlassBlock from "../shared/ui/GlassBlock/GlassBlock";
import GlassSlider from "../shared/ui/GlassSlider/GlassSlider";
import GlassSwitch from "../shared/ui/GlassSwitch/GlassSwitch";

const LiquidGlassPage = () => {
    const [sliderA, setSliderA] = useState(40);
    const [sliderB, setSliderB] = useState(70);
    const [switchA, setSwitchA] = useState(false);
    const [switchB, setSwitchB] = useState(true);
    const [switchC, setSwitchC] = useState(false);

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Colorful background — glass effect needs rich content behind it */}
            <div className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(135deg, #1a0533 0%, #0d1f6e 35%, #063a3a 70%, #1a0533 100%)",
                }}
            />
            {/* Decorative blobs */}
            <div
                className="absolute -z-10 rounded-full blur-3xl opacity-60"
                style={{
                    width: 500,
                    height: 500,
                    top: -100,
                    left: -80,
                    background:
                        "radial-gradient(circle, #c026d3 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute -z-10 rounded-full blur-3xl opacity-50"
                style={{
                    width: 420,
                    height: 420,
                    top: 200,
                    right: -60,
                    background:
                        "radial-gradient(circle, #0ea5e9 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute -z-10 rounded-full blur-3xl opacity-40"
                style={{
                    width: 360,
                    height: 360,
                    bottom: 60,
                    left: "30%",
                    background:
                        "radial-gradient(circle, #10b981 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute -z-10 rounded-full blur-2xl opacity-35"
                style={{
                    width: 260,
                    height: 260,
                    bottom: 200,
                    right: "20%",
                    background:
                        "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
                }}
            />

            {/* Page content */}
            <div className="relative z-10 flex flex-col items-center py-16 px-6 gap-12">
                <h1 className="text-white/80 text-4xl font-light tracking-widest uppercase">
                    Liquid Glass
                </h1>

                {/* Sliders */}
                <section className="flex flex-col items-center gap-6">
                    <h2 className="text-white/50 text-xs uppercase tracking-widest">
                        Slider
                    </h2>
                    <div className="flex flex-col gap-5">
                        <GlassSlider
                            value={sliderA}
                            onChange={setSliderA}
                            width={320}
                            handleSize={36}
                        />
                        <GlassSlider
                            value={sliderB}
                            onChange={setSliderB}
                            width={320}
                            handleSize={28}
                        />
                    </div>
                    <p className="text-white/30 text-sm tabular-nums">
                        {Math.round(sliderA)} · {Math.round(sliderB)}
                    </p>
                </section>

                {/* Switches */}
                <section className="flex flex-col items-center gap-6">
                    <h2 className="text-white/50 text-xs uppercase tracking-widest">
                        Switch
                    </h2>
                    <div className="flex items-center gap-8">
                        <GlassSwitch
                            checked={switchA}
                            onChange={setSwitchA}
                            size={32}
                        />
                        <GlassSwitch
                            checked={switchB}
                            onChange={setSwitchB}
                            size={40}
                        />
                        <GlassSwitch
                            checked={switchC}
                            onChange={setSwitchC}
                            size={28}
                        />
                    </div>
                </section>

                {/* Blocks */}
                <section className="flex flex-col items-center gap-6">
                    <h2 className="text-white/50 text-xs uppercase tracking-widest">
                        Block
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <GlassBlock
                            width={200}
                            height={120}
                            radius={16}
                            depth={20}
                            strength={80}
                            chromaticAberration={2}
                            blur={4}
                            className="flex items-center justify-center"
                        >
                            <span className="text-white/70 text-sm font-light">
                                Card
                            </span>
                        </GlassBlock>

                        <GlassBlock
                            width={120}
                            height={120}
                            radius={60}
                            depth={16}
                            strength={90}
                            chromaticAberration={3}
                            blur={3}
                            className="flex items-center justify-center"
                        >
                            <span className="text-white/70 text-sm font-light">
                                Pill
                            </span>
                        </GlassBlock>

                        <GlassBlock
                            width={200}
                            height={120}
                            radius={8}
                            depth={24}
                            strength={70}
                            chromaticAberration={1}
                            blur={5}
                            className="flex items-center justify-center"
                        >
                            <span className="text-white/70 text-sm font-light">
                                Sharp
                            </span>
                        </GlassBlock>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LiquidGlassPage;
