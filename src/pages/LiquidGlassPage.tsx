import ButtonGlass from "../shared/ui/ButtonGlass/ButtonGlass";
import useDraggable from "../shared/lib/hooks/useDraggable";

type Props = {};

const LiquidGlassPage = (props: Props) => {
    const { bind } = useDraggable();

    return (
        <div className="h-screen">
            <section className="outline w-full h-full relative">
                <div
                    {...bind}
                    style={{
                        ...bind.style, // Merge draggable styles
                    }}
                    className="w-fit"
                    draggable
                >
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
            </section>
        </div>
    );
};

export default LiquidGlassPage;

function setDragging(arg0: boolean) {
    throw new Error("Function not implemented.");
}
//     background-size: 40px 40px;
//     background-image:
//     linear-gradient(to right, grey 1px, transparent 1px),
//     linear-gradient(to bottom, grey 1px, transparent 1px);
