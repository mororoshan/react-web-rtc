import React, { ComponentProps, ReactNode } from "react";

import Button from "../Button/Button";
import { GlassElement } from "../GlassElement";
import type { DisplacementOptions } from "../GlassElement";

type ButtonGlassProps = DisplacementOptions & {
    children: ReactNode;
    className?: string;
    blur?: number;
    debug?: boolean;
    buttonProps?: ComponentProps<typeof Button>;
    onClick?: () => void;
};

const ButtonGlass = ({
    children,
    className,
    buttonProps,
    onClick,
    ...glassProps
}: ButtonGlassProps): JSX.Element => {
    return (
        <GlassElement
            {...glassProps}
            className={className ? `flex items-center justify-center ${className}` : "flex items-center justify-center"}
        >
            <Button
                {...buttonProps}
                onClick={onClick}
                className={`bg-transparent border-none hover:bg-inherit hover:text-inherit${
                    buttonProps?.className ? ` ${buttonProps.className}` : ""
                }`}
            >
                {children}
            </Button>
        </GlassElement>
    );
};

export default ButtonGlass;
