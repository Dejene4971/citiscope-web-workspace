import React from 'react';

/**
 * Semantic color variants for the Button component.
 * Maps to CitiScope's design system color palette.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success';

/**
 * Size options controlling padding and font size.
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Props for the CitiScope Button component.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Submit Report
 * </Button>
 * ```
 */
export interface ButtonProps {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Shows a loading spinner and disables interaction */
  loading?: boolean;
  /** Disables the button */
  disabled?: boolean;
  /** Stretches the button to fill its container */
  fullWidth?: boolean;
  /** Icon rendered before the label */
  startIcon?: React.ReactNode;
  /** Icon rendered after the label */
  endIcon?: React.ReactNode;
  /** Button label content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** HTML button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Accessible label override (use when label is icon-only) */
  'aria-label'?: string;
}
