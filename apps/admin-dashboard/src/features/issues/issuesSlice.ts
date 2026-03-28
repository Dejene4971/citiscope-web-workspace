import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Issue, IssueFilters, PaginatedIssues } from '@citiscope/types';

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
      state.page = action.payload.page;
      state.isLoading = false;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectIssue(state, action: PayloadAction<Issue | null>) {
      state.selected = action.payload;
    },
    setFilters(state, action: PayloadAction<IssueFilters>) {
      state.filters = action.payload;
      state.page = 1;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, selectIssue, setFilters } = issuesSlice.actions;
export default issuesSlice.reducer;
