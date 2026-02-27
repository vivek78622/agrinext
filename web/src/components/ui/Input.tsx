import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-300 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--accent-green)] transition-colors duration-300">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] 
              rounded-xl px-4 py-3 text-white placeholder-gray-500
              focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]/50
              transition-all duration-300
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-400 ml-1 animate-pulse">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
