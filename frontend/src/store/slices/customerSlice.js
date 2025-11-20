import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerAPI } from '../../services/api';

// 고객 목록 조회
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 고객 상세 조회
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 고객 등록
export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await customerAPI.createCustomer(customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 고객 수정
export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await customerAPI.updateCustomer(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 고객 삭제
export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerAPI.deleteCustomer(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customers: [],
    selectedCustomer: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 고객 목록 조회
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 고객 상세 조회
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 고객 등록
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 고객 수정
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
      })
      // 고객 삭제
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c.id !== action.payload);
        if (state.selectedCustomer?.id === action.payload) {
          state.selectedCustomer = null;
        }
      });
  },
});

export const { clearSelectedCustomer, clearError } = customerSlice.actions;
export default customerSlice.reducer;
