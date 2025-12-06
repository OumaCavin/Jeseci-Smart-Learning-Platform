// Search slice for managing search functionality
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, endpoints } from '../../services/api';

export interface SearchResult {
  id: number;
  title: string;
  description: string;
  type: 'learning_path' | 'module' | 'assessment' | 'resource' | 'question';
  content_type?: string;
  url: string;
  thumbnail?: string;
  author?: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  created_at?: string;
  relevance_score?: number;
  highlights?: string[];
}

export interface SearchFilter {
  type?: string[];
  difficulty?: string[];
  tags?: string[];
  author?: string;
  date_range?: {
    start?: string;
    end?: string;
  };
  rating?: {
    min?: number;
    max?: number;
  };
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'tag' | 'category';
  count?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  filters: SearchFilter;
  isLoading: boolean;
  isSearching: boolean;
  hasSearched: boolean;
  totalResults: number;
  currentPage: number;
  resultsPerPage: number;
  sortBy: 'relevance' | 'date' | 'rating' | 'title';
  sortOrder: 'asc' | 'desc';
  error: string | null;
  searchHistory: string[];
}

const initialState: SearchState = {
  query: '',
  results: [],
  suggestions: [],
  filters: {},
  isLoading: false,
  isSearching: false,
  hasSearched: false,
  totalResults: 0,
  currentPage: 1,
  resultsPerPage: 20,
  sortBy: 'relevance',
  sortOrder: 'desc',
  error: null,
  searchHistory: JSON.parse(localStorage.getItem('search_history') || '[]'),
};

// Async thunks
export const searchContent = createAsyncThunk(
  'search/searchContent',
  async (
    {
      query,
      filters = {},
      page = 1,
      sortBy = 'relevance',
      sortOrder = 'desc',
    }: {
      query: string;
      filters?: SearchFilter;
      page?: number;
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => acc.append(key, v));
          } else if (typeof value === 'object' && value !== null) {
            acc.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            acc.append(key, value.toString());
          }
          return acc;
        }, new URLSearchParams()),
      });

      const response = await apiClient.get<{
        results: SearchResult[];
        total: number;
        page: number;
        has_next: boolean;
        has_prev: boolean;
      }>(`${endpoints.search.query}?${params}`);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Search failed');
    }
  }
);

export const getSearchSuggestions = createAsyncThunk(
  'search/getSuggestions',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<SearchSuggestion[]>(
        `${endpoints.search.suggestions}?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to get suggestions');
    }
  }
);

export const getSearchFilters = createAsyncThunk(
  'search/getFilters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        types: string[];
        difficulties: string[];
        tags: string[];
        authors: string[];
      }>(endpoints.search.filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to get filters');
    }
  }
);

// Search slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setFilters: (state, action: PayloadAction<SearchFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateFilters: (state, action: PayloadAction<Partial<SearchFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<'relevance' | 'date' | 'rating' | 'title'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      const newQuery = action.payload.trim();
      if (newQuery && !state.searchHistory.includes(newQuery)) {
        state.searchHistory = [newQuery, ...state.searchHistory.slice(0, 9)]; // Keep last 10
        localStorage.setItem('search_history', JSON.stringify(state.searchHistory));
      }
    },
    clearHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem('search_history');
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(q => q !== action.payload);
      localStorage.setItem('search_history', JSON.stringify(state.searchHistory));
    },
    resetSearch: (state) => {
      state.results = [];
      state.suggestions = [];
      state.hasSearched = false;
      state.totalResults = 0;
      state.currentPage = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search content
      .addCase(searchContent.pending, (state) => {
        state.isLoading = true;
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSearching = false;
        state.results = action.payload.results;
        state.totalResults = action.payload.total;
        state.currentPage = action.payload.page;
        state.hasSearched = true;
        
        // Add query to history
        if (state.query.trim()) {
          const newQuery = state.query.trim();
          if (!state.searchHistory.includes(newQuery)) {
            state.searchHistory = [newQuery, ...state.searchHistory.slice(0, 9)];
            localStorage.setItem('search_history', JSON.stringify(state.searchHistory));
          }
        }
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isSearching = false;
        state.error = action.payload as string;
      })
      
      // Get suggestions
      .addCase(getSearchSuggestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(getSearchSuggestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get filters
      .addCase(getSearchFilters.fulfilled, (state, action) => {
        // This would be used to populate filter options in the UI
        // The data structure might be different from what's expected in SearchFilter
        console.log('Available filters:', action.payload);
      });
  },
});

export const {
  clearError,
  setQuery,
  setFilters,
  clearFilters,
  updateFilters,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  addToHistory,
  clearHistory,
  removeFromHistory,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;