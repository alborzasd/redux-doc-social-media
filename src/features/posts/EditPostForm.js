import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { postUpdated, selectPostById } from "./postsSlice";

export const EditPostForm = ({match}) => {
    const {postId} = match.params;

    const post = useSelector(state =>
        selectPostById(state, postId)
    );

    const [title, setTitle] = useState(post?.title);
    const [content, setContent] = useState(post?.content);

    const dispatch = useDispatch();
    const history = useHistory();

    const onTitleChanged = (e) => setTitle(e.target.value);
    const onContentChanged = (e) => setContent(e.target.value);

    // If the post from the selector result is undefined,
    // then this handler never be executed
    // because the button will never be rendered so will never add this handler
    const onSubmit = (e) => {
        e.preventDefault();
        if(title && content) {
            dispatch(postUpdated({
                id: postId,
                title,
                content
            }));
            history.push(`/posts/${postId}`);
        }
    }

    if(!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        );
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postContent">Post Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="submit">Save Post</button>
            </form>
        </section>
    );

}