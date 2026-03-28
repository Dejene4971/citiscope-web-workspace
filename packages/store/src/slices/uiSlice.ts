import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }[];
}

const initialState: UIState = {
  sidebarOpen: true,
  activeModal: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    addNotification(state, action: PayloadAction<UIState['notifications'][0]>) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, openModal, closeModal, addNotification, removeNotification } =
  uiSlice.actions;
export default uiSlice.reducer;
