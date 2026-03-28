import React from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  required?: boolean;
}

/** Labelled input field wired to react-hook-form. */
export const FormField: React.FC<FormFieldProps> = ({
  label, registration, error, type = 'text', placeholder, required,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>
      {label}{required && <span style={{ color: '#d32f2f' }}> *</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      aria-invalid={!!error}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        border: `1px solid ${error ? '#d32f2f' : '#ccc'}`,
        fontSize: '0.9375rem',
        outline: 'none',
      }}
      {...registration}
    />
    {error && <span style={{ color: '#d32f2f', fontSize: '0.8125rem' }}>{error.message}</span>}
  </div>
);
