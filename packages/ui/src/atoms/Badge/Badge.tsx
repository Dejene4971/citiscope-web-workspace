import React from 'react';
import type { BadgeProps } from './Badge.types';
import styles from './Badge.module.css';

/**
 * CitiScope Badge — status/category pill with optional dot indicator.
 *
 * @example
 * ```tsx
 * <Badge label="Critical" variant="danger" dot />
 * <Badge label="Resolved" variant="success" />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'medium',
  dot = false,
  className,
}) => (
  <span
    className={[styles.badge, styles[variant], styles[size], className ?? ''].filter(Boolean).join(' ')}
    aria-label={label}
  >
    {dot && <span className={styles.dot} aria-hidden="true" />}
    {label}
  </span>
);

Badge.displayName = 'Badge';
