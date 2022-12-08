// React modules
import { createAsyncThunk } from '@reduxjs/toolkit';

// External module
import axios from 'axios';

// Models
import { User } from '../models/user';

export const UserService = {
  retrieve: createAsyncThunk(
    'user/retrieve',
    async (userId: any, {rejectWithValue})=>{
      try {
        const resp = await axios.get(`/users/${userId}`);
        return resp.data;
      } catch( error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  ),
  update: createAsyncThunk(
    'user/update',
    async (user: User, {rejectWithValue}) => {
      try {
        const resp = await axios.put(`/users/${user.pk}`, user);
        return resp.data;
      } catch ( error: any ) {
        return rejectWithValue(error.response.data);
      }
    }
  )
}