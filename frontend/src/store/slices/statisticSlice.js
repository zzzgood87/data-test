import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { statisticAPI } from '../../services/api';

// 대시보드 통계 조회
export const fetchDashboardStats = createAsyncThunk(
  'statistic/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticAPI.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 고객 관리 통계 조회
export const fetchCustomerStats = createAsyncThunk(
  'statistic/fetchCustomerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticAPI.getCustomerStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const statisticSlice = createSlice({
  name: 'statistic',
  initialState: {
    dashboard: null,
    customerStats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.customerStats = action.payload;
      });
  },
});

export const { clearError } = statisticSlice.actions;
export default statisticSlice.reducer;
