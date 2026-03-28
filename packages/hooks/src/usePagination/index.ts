import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPerPage?: number;
}

/** Simple pagination state manager. */
export function usePagination({ initialPage = 1, initialPerPage = 20 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const nextPage = useCallback(() => setPage(p => p + 1), []);
  const prevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const goToPage = useCallback((p: number) => setPage(Math.max(1, p)), []);
  const reset = useCallback(() => setPage(initialPage), [initialPage]);

  return { page, perPage, setPerPage, nextPage, prevPage, goToPage, reset };
}
