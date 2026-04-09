import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 'issue-detail' | 'issue-create' | 'confirm' | null;

interface UINotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  source: 'iot' | 'issue' | 'system';
}

interface UIState {
  selectedIssueId: string | null;
  activeModal: ModalType;
  notifications: UINotification[];
  unreadCount: number;
}

const initialState: UIState = {
  selectedIssueId: null,
  activeModal: null,
  notifications: [],
  unreadCount: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedIssueId(state, action: PayloadAction<string | null>) {
      state.selectedIssueId = action.payload;
      if (action.payload) state.activeModal = 'issue-detail';
    },
    openModal(state, action: PayloadAction<ModalType>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
      state.selectedIssueId = null;
    },
    addNotification(state, action: PayloadAction<Omit<UINotification, 'id' | 'timestamp' | 'read'>>) {
      const notif: UINotification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notif);
      state.unreadCount += 1;
      // Keep max 100
      if (state.notifications.length > 100) state.notifications.pop();
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n && !n.read) { n.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
    },
    markAllRead(state) {
      state.notifications.forEach(n => { n.read = true; });
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setSelectedIssueId, openModal, closeModal,
  addNotification, markNotificationRead, markAllRead, clearNotifications,
} = uiSlice.actions;
export default uiSlice.reducer;
