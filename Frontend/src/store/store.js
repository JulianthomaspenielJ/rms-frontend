import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import navigationReducer from './slices/navigationSlice';

// Combine reducers
const rootReducer = combineReducers({
  navigation: navigationReducer,
  // Add other reducers here
});

// Create store with middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['navigation/updateNavigation'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.lastUpdated'],
        // Ignore these paths in the state
        ignoredPaths: ['navigation.lastUpdated'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
