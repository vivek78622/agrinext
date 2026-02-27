import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className = '',
        variant = 'primary',
        size = 'md',
        isLoading,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
    }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-gradient-to-r from-[var(--accent-green)] to-[#00C853] text-black shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:shadow-[0_0_30px_rgba(0,230,118,0.5)] hover:scale-[1.02]",
            secondary: "bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.2)]",
            outline: "bg-transparent border border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)]/10",
            ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
        };

        const sizes = {
            sm: "text-xs px-3 py-1.5 gap-1.5",
            md: "text-sm px-5 py-2.5 gap-2",
            lg: "text-base px-6 py-3.5 gap-2.5"
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        {leftIcon}
                        {children}
                        {rightIcon}
                    </>
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
