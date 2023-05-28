import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
});

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    /* _ at first argument means we dont need it here it's just a placeholder to skip and receive the getState property of the second argument */
    async(_, {getState}) => {
        const allNotifications = selectAllNotifications(getState());
        const [latestNotification] = allNotifications;
        const latestTimestamp = latestNotification ? latestNotification.date : '';
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        );
        return response.data;
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state) {
            Object.values(state.entities).forEach(notification => {
                notification.read = true
            });
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                notificationsAdapter.upsertMany(state, action.payload);        
                Object.values(state.entities).forEach(notification => {
                    // Any notifications we've read are no longer new
                    notification.isNew = !notification.read;
                });
                // Sort with newest first (now it will be automatically sorted by adapter)
                // state.sort((a, b) => b.date.localeCompare(a.date));
            });
    } 
});

export const {allNotificationsRead} = notificationsSlice.actions;

export default notificationsSlice.reducer;

// export const selectAllNotifications = state => state.notifications;

export const {
    selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications);