import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

/**
 * Windowed list — only renders visible rows + overscan buffer.
 * Handles thousands of items without performance degradation.
 */
export function VirtualList<T>({
  items, itemHeight, containerHeight, renderItem, overscan = 3,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex   = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  }, []);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <Box
      ref={containerRef}
      onScroll={onScroll}
      sx={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
    >
      <Box sx={{ height: totalHeight, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: startIndex * itemHeight, width: '100%' }}>
          {visibleItems.map((item, i) => (
            <Box key={startIndex + i} sx={{ height: itemHeight, overflow: 'hidden' }}>
              {renderItem(item, startIndex + i)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
