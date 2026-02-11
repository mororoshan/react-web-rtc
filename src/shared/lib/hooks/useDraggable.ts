import { useState, useCallback, useEffect, useRef } from "react";

interface Position {
    x: number;
    y: number;
}

interface DraggableBindings {
    ref: React.RefObject<HTMLDivElement>;
    onMouseDown: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
}

const useDraggable = (): { position: Position; bind: DraggableBindings } => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });

    const elementRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();

        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });

        setDragging(true);
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!dragging || !elementRef.current) return;

            const element = elementRef.current;
            const parent = element.parentElement;
            if (!parent) return;

            const parentRect = parent.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            let newX = e.clientX - parentRect.left - offset.x;
            let newY = e.clientY - parentRect.top - offset.y;

            const maxX = parentRect.width - elementRect.width;
            const maxY = parentRect.height - elementRect.height;

            newX = Math.max(0, Math.min(maxX, newX));
            newY = Math.max(0, Math.min(maxY, newY));

            setPosition({ x: newX, y: newY });
        },
        [dragging, offset],
    );

    const handleMouseUp = useCallback(() => {
        setDragging(false);
    }, []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, handleMouseMove, handleMouseUp]);

    return {
        position,
        bind: {
            ref: elementRef,
            onMouseDown: handleMouseDown,
            style: {
                position: "absolute",
                left: position.x,
                top: position.y,
                cursor: dragging ? "grabbing" : "grab",
            },
        },
    };
};

export default useDraggable;
