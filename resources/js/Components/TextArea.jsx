import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextareaInput(
    { className = '', isFocused = false, rows = 3, ...props },
    ref
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            rows={rows}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 appearance-none ' +
                className
            }
            ref={localRef}
        />
    );
});
