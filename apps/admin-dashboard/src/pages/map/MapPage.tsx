import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, IssueMarker } from '@citiscope/map';
import { fetchStart, fetchSuccess, fetchFailure, selectIssue } from '../../features/issues/issuesSlice';
import type { RootState, AppDispatch } from '../../store/store';
import type { Issue } from '@citiscope/types';

export const MapPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: issues, isLoading } = useSelector((s: RootState) => s.issues);

  useEffect(() => {
    // Mock data — replace with real API call
    dispatch(fetchStart());
    setTimeout(() => {
      dispatch(fetchSuccess({ data: [], total: 0, page: 1, per_page: 20 }));
    }, 500);
  }, [dispatch]);

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      {isLoading ? (
        <p style={{ padding: 24 }}>Loading map…</p>
      ) : (
        <MapContainer>
          {issues.map(issue => (
            <IssueMarker
              key={issue.issue_id}
              issue={issue}
              onClick={(i: Issue) => dispatch(selectIssue(i))}
            />
          ))}
        </MapContainer>
      )}
    </div>
  );
};
