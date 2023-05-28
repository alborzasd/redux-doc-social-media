import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit';
// import { nanoid } from '@reduxjs/toolkit';
import { client } from '../../api/client';
// import {sub} from 'date-fns';

// TODO: must be deleted, temporary data for test
// const initialState = [
//     {
//         id: '1',
//         title: 'First Post!',
//         content: 'Hello!',
//         user: '0',
//         date: sub(new Date(), {minutes: 10}).toISOString(),
//         reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
//     },
//     {
//         id: '2',
//         title: 'Second Post',
//         content: 'More text',
//         user: '2',
//         date: sub(new Date(), {minutes: 5}).toISOString(),
//         reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
//     }
// ];

// {
//     // Multiple possible status enum values
//     status: 'idle' | 'loading' | 'succeeded' | 'failed',
//     error: string | null
// }


const postAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postAdapter.getInitialState({
    status: 'idle',
    error: null
})

// const initialState = {
//     posts: [],
//     status: 'idle',
//     error: null
// }

export const /* thunk action creator => */ fetchPosts = createAsyncThunk('posts/fetchPosts', /* payload creation callback => */ async () => {
    const response = await client.get('/fakeApi/posts');
    return response.data;
});

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        // We send the initial data to API server
        const response = await client.post('/fakeApi/posts', initialPost);
        // The response includes the complete post object, including unique ID
        return response.data;
    } 
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,

    reducers: {
        // postAdded: {
        //     reducer(state, action) {
        //         state.posts.push(action.payload);
        //     },
        //     // prepares action.payload before calling reducer
        //     prepare(title, content, userId) {
        //         return {
        //             payload: {
        //                 id: nanoid(),
        //                 title,
        //                 content,
        //                 user: userId,
        //                 date: new Date().toISOString(),
        //                 reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
        //             }
        //         }
        //     }
        // },

        postUpdated(state, action){
            const {id, title, content} = action.payload;
            const existingPost = state.entities[id]
            if(existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },

        reactionAdded(state, action) {
            const {postId, reaction} = action.payload;
            const existingPost = state.entities[postId];
            if(existingPost) {
                existingPost.reactions[reaction]++;
            }
        }
    },

    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add any fetched posts to the array
                // Use the 'upsertMany' reducer as a mutating update utility
                postAdapter.upsertMany(state, action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, postAdapter.addOne);
    }
});

export const { /*postAdded,*/ postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

// Export the customized selectors for this adapter using 'getSelectors'
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // pass in a selector that returns the posts slice of state
} = postAdapter.getSelectors(state => state.posts);

// selector callbacks
// export const selectAllPosts = state => state.posts.posts;

// export const selectPostById = (state, postId) => (
//     state.posts.posts.find(post => post.id === postId)
// );

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => { /*console.log('Output Selector ran');*/ return posts.filter(post => post.user === userId);}
);
