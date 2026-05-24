/**
 * FormInput – reusable labeled input with error display.
 */
import React, { forwardRef } from 'react';

const FormInput = forwardRef(function FormInput(
  { label, id, error, type = 'text', required = false, className = '', wrapperClass = '', rightIcon, ...rest },
  ref
) {
  return (
    <div className={`space-y-1 ${wrapperClass}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          className={`${error ? 'form-input-error' : 'form-input'} ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});

export default FormInput;


/**
 * FormSelect – styled select input.
 */
export function FormSelect({ label, id, error, children, required = false, wrapperClass = '', ...rest }) {
  return (
    <div className={`space-y-1 ${wrapperClass}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select id={id} className={error ? 'form-input-error form-select' : 'form-select'} {...rest}>
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
