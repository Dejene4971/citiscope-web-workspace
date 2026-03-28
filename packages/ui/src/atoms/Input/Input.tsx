import React, { useId } from 'react';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

/**
 * CitiScope Input — labelled text field with adornment and validation support.
 */
export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  defaultValue,
  type = 'text',
  size = 'medium',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  startAdornment,
  endAdornment,
  onChange,
  onBlur,
  name,
  id: idProp,
  className,
}) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const wrapperClass = [
    styles.wrapper,
    styles[size],
    fullWidth ? styles.fullWidth : '',
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles.inputRow}>
        {startAdornment && <span className={styles.adornment}>{startAdornment}</span>}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className={styles.input}
        />
        {endAdornment && <span className={styles.adornment}>{endAdornment}</span>}
      </div>
      {error && <span id={`${id}-error`} className={styles.errorText} role="alert">{error}</span>}
      {!error && helperText && <span id={`${id}-helper`} className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

Input.displayName = 'Input';
