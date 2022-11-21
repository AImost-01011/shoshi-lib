import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BookType, supporterType } from "./globalType";

const initialState: supporterType = {
  isNavOpen: false,
  isNavMove: false,
  userId: "",
  isSkip: true,
  search: {
    isLoading: false,
    books: [],
  },
  lineId: "",
};

export const searchByTagId = createAsyncThunk<
  any,
  { state: string[]; usage: string[]; department: string[] }
>("supporter/async", ({ state, usage, department }) =>
  axios
    .post("/api/book/read/search", {
      state: state,
      usage: usage,
      department: department,
    })
    .then((item) => item.data as BookType[])
    .catch((err) => console.log(err))
);

export const supporterSlice = createSlice({
  name: "Supporter",
  initialState: initialState,
  reducers: {
    toggleNav: (state) => {
      state.isNavOpen = !state.isNavOpen;
    },

    moveNav: (state) => {
      state.isNavMove = true;
    },
    stopNav: (state) => {
      state.isNavMove = false;
    },

    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      state.isSkip = false;
    },

    setLineId: (state, action: PayloadAction<string>) => {
      state.lineId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchByTagId.pending, (state) => {
      state.search.isLoading = true;
    });

    builder.addCase(
      searchByTagId.fulfilled,
      (state, action: PayloadAction<BookType[]>) => {
        state.search.isLoading = false;
        state.search.books = action.payload;
      }
    );
  },
});

export const { toggleNav, moveNav, stopNav, setUserId, setLineId } =
  supporterSlice.actions;
export const supporterReducer = supporterSlice.reducer;
