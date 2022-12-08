// React
import { createAsyncThunk } from '@reduxjs/toolkit';

// external modules
import axios from 'axios';

// models
import { Feed } from '../models/feed';

export const FeedService = {
    list: createAsyncThunk(
        'feed/list',
        async (_: void, {rejectWithValue}) => {
            try {
                const resp = await axios.get('/feeds');
                return {
                    totalCount: resp.data.count, 
                    items: [...resp.data.results]
                }
            } catch(error:any) {
                return rejectWithValue(error.response.data.message);
            }
        }
    ),
    create: createAsyncThunk(
        'feed/create',
        async (feed: FormData, {rejectWithValue})=>{
            try {
                const resp = await axios.post('/feeds', feed);
                return resp.data;
            } catch (error: any) {
                return rejectWithValue(error.response.data.message);
            }
        }

    )
}