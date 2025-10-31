import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllFaq } from '@/apis/apis';

const initialState = {
  faqs: [],
  loading: false,
  error: null,
  activeIndexes: [],
};

export const fetchFaqs = createAsyncThunk(
  'faq/fetchFaqs',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await getAllFaq(queryParams);
      if (response?.status === 200 && Array.isArray(response.data)) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch FAQs or invalid data structure');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch FAQs');
    }
  },
);

export const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    setActiveIndexes: (state, action) => {
      state.activeIndexes = action.payload;
    },
    toggleActiveIndex: (state, action) => {
      const index = action.payload;
      if (state.activeIndexes.includes(index)) {
        state.activeIndexes = state.activeIndexes.filter(i => i !== index);
      } else {
        state.activeIndexes.push(index);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFaqs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.faqs = action.payload;
        state.loading = false;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveIndexes, toggleActiveIndex } = faqSlice.actions;

export default faqSlice.reducer;
