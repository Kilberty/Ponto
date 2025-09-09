import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
  { type = 'text', className = '', isFocused = false, ...props },
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
    <input
      {...props}
      type={type}
      name="nope"                  // nome aleatório para evitar autofill
      autoComplete="new-password"  // evita sugestões de senha/autofill
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      inputMode="text"             // indica teclado de texto simples
      className={
        'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ' +
        className
      }
      ref={localRef}
    />
  );
});
