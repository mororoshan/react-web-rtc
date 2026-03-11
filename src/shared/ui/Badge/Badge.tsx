import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-gray-600/80 text-gray-200 border-gray-500",
    success: "bg-emerald-600/80 text-emerald-100 border-emerald-500",
    warning: "bg-amber-600/80 text-amber-100 border-amber-500",
    danger: "bg-rose-600/80 text-rose-100 border-rose-400",
    info: "bg-sky-600/80 text-sky-100 border-sky-400",
};

export const Badge = ({
    children,
    variant = "default",
    className = "",
}: BadgeProps) => (
    <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
        {children}
    </span>
);
