import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { client } from "../../api/client";

// TODO: must be deleted, temporary data for test
// const initialState = [
//     {id: '0', name: 'Alborz Asadi'},
//     {id: '1', name: 'Richard Vahid'},
//     {id: '2', name: 'Mohsen Karami'},
// ];

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users');
    return response.data;
});

const usersSlice = createSlice({
    name: 'users',
    initialState,

    reducers: {},

    extraReducers(builder){
        builder
            .addCase(fetchUsers.fulfilled, usersAdapter.setAll);
    }
});

export default usersSlice.reducer;

// selector callbacks
// export const selectAllUsers = (state) => state.users;

// export const selectUserById = (state, userId) => 
//     state.users.find(user => user.id === userId);

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById
} = usersAdapter.getSelectors(state => state.users)