import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import { postAdded } from "./postsSlice";
import { addNewPost } from "./postsSlice";

import { selectAllUsers } from "../users/usersSlice";

export const AddPostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');

    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    const dispatch = useDispatch();

    const users = useSelector(selectAllUsers);

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const onSubmit = async (e) => {
        e.preventDefault();
        if(canSave) {
            try{
                setAddRequestStatus('pending');
                await dispatch(addNewPost({title, content, user: userId})).unwrap();
                setTitle('');
                setContent('');
                setUserId('');
            }
            catch(err){
                console.error('Failed to save the post', err);
            }
            finally{
                setAddRequestStatus('idle');
            }
        }
    }

    const canSave = 
        [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

    const renderedUsersOptions = users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ));

    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {renderedUsersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="submit" disabled={!canSave}>Save Post</button>
            </form>
        </section>
    );
}