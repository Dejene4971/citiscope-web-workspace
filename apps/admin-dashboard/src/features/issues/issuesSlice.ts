import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Issue, IssueFilters, PaginatedIssues } from '@citiscope/types';
import { auditService } from '../../services/auditService';

interface IssuesState {
  items: Issue[];
  selected: Issue | null;
  filters: IssueFilters;
  total: number;
  page: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: IssuesState = {
  items: [],
  selected: null,
  filters: {},
  total: 0,
  page: 1,
  isLoading: false,
  error: null,
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    fetchStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccess(state, action: PayloadAction<PaginatedIssues>) {
      state.items = action.payload.data;
      state.total = action.payload.total;
      state.page  = action.payload.page;
      state.isLoading = false;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addIssue(state, action: PayloadAction<Issue>) {
      state.items.unshift(action.payload);
      state.total += 1;
      auditService.log('CREATE_ISSUE', {
        entityId: action.payload.issue_id,
        entityType: 'issue',
        payload: { title: action.payload.title, severity: action.payload.severity },
      });
    },
    selectIssue(state, action: PayloadAction<Issue | null>) {
      state.selected = action.payload;
    },
    updateIssueStatus(state, action: PayloadAction<{ issueId: string; status: Issue['status']; userId?: string }>) {
      const issue = state.items.find(i => i.issue_id === action.payload.issueId);
      if (issue) {
        const prev = issue.status;
        issue.status = action.payload.status;
        auditService.log(
          action.payload.status === 'resolved' ? 'RESOLVE_ISSUE' : 'UPDATE_STATUS',
          { entityId: issue.issue_id, entityType: 'issue', userId: action.payload.userId, payload: { from: prev, to: action.payload.status } }
        );
      }
    },
    assignTechnician(state, action: PayloadAction<{ issueId: string; technicianId: string; userId?: string }>) {
      const issue = state.items.find(i => i.issue_id === action.payload.issueId);
      if (issue) {
        issue.assigned_to = action.payload.technicianId;
        issue.status = 'assigned';
        auditService.log('ASSIGN_TECHNICIAN', {
          entityId: issue.issue_id,
          entityType: 'issue',
          userId: action.payload.userId,
          payload: { technicianId: action.payload.technicianId },
        });
      }
    },
    setFilters(state, action: PayloadAction<IssueFilters>) {
      state.filters = action.payload;
      state.page = 1;
    },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  addIssue, selectIssue, updateIssueStatus, assignTechnician, setFilters,
} = issuesSlice.actions;
export default issuesSlice.reducer;
