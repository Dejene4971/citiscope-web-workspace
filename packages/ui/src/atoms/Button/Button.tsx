import React from 'react';
import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';

/**
 * CitiScope Button — primary interactive element.
 *
 * Supports five semantic variants, three sizes, loading/disabled states,
 * full-width layout, and optional leading/trailing icons.
 *
 * @example
 * ```tsx
 * // Primary action
 * <Button variant="primary" onClick={handleSubmit}>Submit Report</Button>
 *
 * // Destructive action with loading state
 * <Button variant="danger" loading={isDeleting}>Delete Issue</Button>
 *
 * // With icons
 * <Button variant="success" startIcon={<CheckIcon />}>Resolve</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  onClick,
  type = 'button' as const,
  className,
  style,
  'aria-label': ariaLabel,
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={classNames}
      style={style}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={isDisabled}
    >
      {loading ? (
        <span className={styles.spinner} role="status" aria-label="Loading" />
      ) : (
        <>
          {startIcon && (
            <span className={styles.iconWrapper} aria-hidden="true">
              {startIcon}
            </span>
          )}
          {children}
          {endIcon && (
            <span className={styles.iconWrapper} aria-hidden="true">
              {endIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

Button.displayName = 'Button';
