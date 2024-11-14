import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {Filters} from "../../types";

interface AppStateSlice {
    fullVersion: boolean;
    filters: Filters;
}

const initialState: AppStateSlice = {
    fullVersion: false,
    filters: Filters.All,
}
export const AppStateSlice = createSlice({
    name: 'AppState',
    initialState,
    reducers: {
        changeFullVersion(state, action: PayloadAction<boolean>) {
            state.fullVersion = action.payload;
        },
        changeFilters(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
    }
})
export const {changeFullVersion, changeFilters} = AppStateSlice.actions;
export const selectAppVersion = (state: RootState) => state.appState.fullVersion
export const selectAppFilters = (state: RootState) => state.appState.filters
export default AppStateSlice.reducer;