import { useState } from "react";

import BlockGlass from "../shared/ui/BlockGlass/BlockGlass";
import ButtonGlass from "../shared/ui/ButtonGlass/ButtonGlass";
import SliderGlass from "../shared/ui/SliderGlass/SliderGlass";
import SwitchGlass from "../shared/ui/SwitchGlass/SwitchGlass";
import useDraggable from "../shared/lib/hooks/useDraggable";

type Props = {};

const LiquidGlassPage = (props: Props) => {
    const { bind } = useDraggable();
    const [sliderValue, setSliderValue] = useState(50);
    const [switchChecked, setSwitchChecked] = useState(false);

    return (
        <div className="h-screen bg-gradient-to-br from-slate-400 via-slate-300 to-amber-200">
            <section className="w-full h-full relative p-8">
                <div className="flex flex-col gap-12 max-w-2xl">
                    {/* Draggable button */}
                    <div {...bind} style={{ ...bind.style }} className="w-fit" draggable>
                        <ButtonGlass
                            width={100}
                            height={100}
                            radius={0}
                            depth={80}
                            blur={0}
                            chromaticAberration={2}
                            strength={10}
                        >
                            Button
                        </ButtonGlass>
                    </div>

                    {/* Slider with glass handle */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">
                            Slider (glass handle)
                        </label>
                        <SliderGlass
                            value={sliderValue}
                            onChange={setSliderValue}
                            min={0}
                            max={100}
                            trackWidth={240}
                        />
                        <span className="text-xs text-slate-600">Value: {sliderValue}</span>
                    </div>

                    {/* Switch with glass handle */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700">
                            Switch (glass handle)
                        </label>
                        <SwitchGlass
                            checked={switchChecked}
                            onChange={setSwitchChecked}
                        />
                        <span className="text-xs text-slate-600">
                            {switchChecked ? "On" : "Off"}
                        </span>
                    </div>

                    {/* Block with glass background */}
                    <BlockGlass width={320} height={120} radius={16} depth={20}>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                            Glass block
                        </h3>
                        <p className="text-sm text-slate-600">
                            This block has a glass background. The liquid displacement
                            effect creates a frosted, refractive look.
                        </p>
                    </BlockGlass>
                </div>
            </section>
        </div>
    );
};

export default LiquidGlassPage;
