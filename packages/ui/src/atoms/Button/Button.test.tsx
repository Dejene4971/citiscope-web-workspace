import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { Button } from './Button';

describe('Button', () => {
  // Rendering
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders with default variant and size', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/primary/);
    expect(btn.className).toMatch(/medium/);
  });

  // Variants
  it.each(['primary', 'secondary', 'danger', 'warning', 'success'] as const)(
    'applies %s variant class',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button').className).toMatch(variant);
    }
  );

  // Sizes
  it.each(['small', 'medium', 'large'] as const)('applies %s size class', (size) => {
    render(<Button size={size}>{size}</Button>);
    expect(screen.getByRole('button').className).toMatch(size);
  });

  // Full width
  it('applies fullWidth class when prop is set', () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole('button').className).toMatch(/fullWidth/);
  });

  // Disabled state
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', () => {
    const handler = jest.fn();
    render(<Button disabled onClick={handler}>Disabled</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  // Loading state
  it('shows spinner and hides children when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-busy when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  // Icons
  it('renders startIcon', () => {
    render(<Button startIcon={<span data-testid="start-icon" />}>With Icon</Button>);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders endIcon', () => {
    render(<Button endIcon={<span data-testid="end-icon" />}>With Icon</Button>);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  // Click handler
  it('calls onClick with the mouse event', () => {
    const handler = jest.fn();
    render(<Button onClick={handler}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  // Accessibility
  it('uses aria-label when provided', () => {
    render(<Button aria-label="Close dialog">X</Button>);
    expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
  });

  it('has type="button" by default', () => {
    render(<Button>Default type</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respects type="submit"', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
