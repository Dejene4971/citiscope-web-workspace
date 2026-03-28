import React, { useState } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
}

/**
 * Search input that fires onSearch after a debounce delay.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search…',
  onSearch,
  debounceMs = 300,
  className,
}) => {
  const [value, setValue] = useState('');
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(q), debounceMs);
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '1.5px solid #d1d5db',
        borderRadius: 8,
        padding: '6px 12px',
        background: '#fff',
      }}
    >
      <span aria-hidden="true" style={{ color: '#9ca3af' }}>🔍</span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.9375rem', background: 'transparent' }}
      />
    </div>
  );
};
