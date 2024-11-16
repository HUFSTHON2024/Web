import { configureStore, createSlice } from '@reduxjs/toolkit';

let video = createSlice({
  name: 'videos',
  initialState: {
    files: [],
  },
  reducers: {
    addVideo(state, action) {
      state.files.push(action.payload); // 비디오 파일 추가
    },
  },
});

export const { addVideo } = video.actions;

const store = configureStore({
  reducer: {
    videos: video.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 직렬화 검사 비활성화
    }),
});

export default store;
