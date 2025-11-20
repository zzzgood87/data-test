import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todoAPI } from '../../services/api';

// Todo 목록 조회
export const fetchTodos = createAsyncThunk(
  'todo/fetchTodos',
  async (date, { rejectWithValue }) => {
    try {
      const response = await todoAPI.getTodos(date);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Todo 추가
export const createTodo = createAsyncThunk(
  'todo/createTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await todoAPI.createTodo(todoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Todo 완료 토글
export const toggleTodoComplete = createAsyncThunk(
  'todo/toggleTodoComplete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await todoAPI.toggleComplete(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    todos: [],
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
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(toggleTodoComplete.fulfilled, (state, action) => {
        const index = state.todos.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;
