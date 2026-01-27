import { createSlice } from '@reduxjs/toolkit';

interface NotificationsState {
  hasUnread: boolean;
}

const initialState: NotificationsState = {
  hasUnread: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setHasUnread: (state, action) => {
      state.hasUnread = action.payload;
    },
  },
});

export const { setHasUnread } = notificationsSlice.actions;

export default notificationsSlice.reducer;