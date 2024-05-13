import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", inputClassName = "", disabled, ...rest }, ref) => {

        return (
            <input
                {...rest}
                className={`border border-1 border-black px-4 py-2 ${inputClassName}`}
                ref={ref}
            />
        );
    }
);

export default Input;
