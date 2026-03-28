import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@citiscope/store';
import { fetchStart, fetchSuccess, fetchFailure, selectIssue, setFilters } from '@citiscope/store';
import type { IssueFilters } from '@citiscope/types';

/** Access issues state and fetch actions. */
export function useIssues() {
  const dispatch = useDispatch<AppDispatch>();
  const issues = useSelector((state: RootState) => state.issues);

  const fetchIssues = async (filters?: IssueFilters) => {
    dispatch(fetchStart());
    try {
      const params = new URLSearchParams(filters as Record<string, string>);
      const res = await fetch(`/api/issues?${params}`);
      if (!res.ok) throw new Error('Failed to fetch issues');
      const data = await res.json();
      dispatch(fetchSuccess(data));
    } catch (err) {
      dispatch(fetchFailure(err instanceof Error ? err.message : 'Fetch failed'));
    }
  };

  return {
    ...issues,
    fetchIssues,
    selectIssue: (issue: Parameters<typeof selectIssue>[0]) => dispatch(selectIssue(issue)),
    setFilters: (f: IssueFilters) => dispatch(setFilters(f)),
  };
}
