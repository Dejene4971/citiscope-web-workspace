import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable, SearchBar, Badge } from '@citiscope/ui';
import { fetchStart, fetchSuccess, selectIssue } from '../../features/issues/issuesSlice';
import type { RootState, AppDispatch } from '../../store/store';
import type { Issue } from '@citiscope/types';
import { STATUS_BADGE_VARIANT, titleCase, formatDate } from '@citiscope/ui';

const columns = [
  { key: 'title', header: 'Title' },
  { key: 'category', header: 'Category', render: (r: Issue) => titleCase(r.category) },
  {
    key: 'severity', header: 'Severity',
    render: (r: Issue) => <Badge label={titleCase(r.severity)} variant={STATUS_BADGE_VARIANT[r.severity] as never} />,
  },
  {
    key: 'status', header: 'Status',
    render: (r: Issue) => <Badge label={titleCase(r.status)} variant={STATUS_BADGE_VARIANT[r.status] as never} dot />,
  },
  { key: 'reported_at', header: 'Reported', render: (r: Issue) => formatDate(r.reported_at) },
];

export const IssuesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((s: RootState) => s.issues);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchStart());
    // Mock data — replace with real API call
    setTimeout(() => {
      dispatch(fetchSuccess({ data: [], total: 0, page: 1, per_page: 20 }));
    }, 500);
  }, [dispatch]);

  const filtered = search
    ? items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Issues</h2>
        <SearchBar placeholder="Search issues…" onSearch={setSearch} />
      </div>
      <DataTable
        columns={columns as never}
        data={filtered as never}
        keyField="issue_id"
        loading={isLoading}
        emptyMessage="No issues found"
        onRowClick={row => dispatch(selectIssue(row as Issue))}
      />
    </div>
  );
};
