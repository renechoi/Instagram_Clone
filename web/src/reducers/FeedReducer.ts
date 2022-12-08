// react
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

// models
import { Feed, FeedState, InitFeedState } from '../models/feed';

// Services
import { FeedService } from '../services/FeedService';

export const FeedSlice = createSlice({
    name: 'feed',
    initialState: InitFeedState,
    reducers: {
        ShowCreateFeedFormModal: (state: FeedState) => {
            state.createFeedFormModal = true;
        },
        HideCreateFeedFormModal: (state: FeedState) => {
            state.createFeedFormModal = false;
        }
    },
    extraReducers: {
        [FeedService.list.pending.type]: (state) => {
            state = {...InitFeedState, loading: true};
        },
        [FeedService.list.fulfilled.type]: (state, {payload} : PayloadAction<any>) => {
            state.loading = false;
            state.totalCount = payload.totalCount;
            state.feeds.items = [...payload.items];
        },
        [FeedService.list.rejected.type]: (state, {payload} : PayloadAction<any>) => {
            state.loading = false;
            state.error = payload;
        },
        [FeedService.create.pending.type]: (state) => {
            state = {...InitFeedState, loading: true};
        },
        [FeedService.create.fulfilled.type]: (state, {payload} : PayloadAction<any>) => {
            state.loading = false;
        },
        [FeedService.create.rejected.type]: (state, {payload} : PayloadAction<any>) => {
            state.loading = false;
            state.error = payload;
        },
    }
});

export const {
    ShowCreateFeedFormModal,
    HideCreateFeedFormModal
} = FeedSlice.actions;

export default FeedSlice.reducer;