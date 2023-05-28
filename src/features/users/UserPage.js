import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectUserById } from "./usersSlice";
import { selectPostsByUser } from "../posts/postsSlice";

export const UserPage = ({ match }) => {
    // TODO: [bug or feature?] if a user jumps right to the '/users' path then click on one of the authors
    // he will not see the posts of the selected author
    // because the posts will be fetched only in the useEffect of the PostsList component

    const {userId} = match.params;

    const user = useSelector(state => selectUserById(state, userId));

    // const postsForUser = useSelector(state => {
    //     const allPosts = selectAllPosts(state);
    //     return allPosts.filter(post => post.user === userId);
    // });

    const postsForUser = useSelector(state => selectPostsByUser(state, userId));

    const renderedPostTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ));

    if(!user) {
        return (
            <section>
                <h2>User not found!</h2>
            </section>
        );
    }

    return (
        <section>
            <h2>{user.name}</h2>
            <ul>{renderedPostTitles}</ul>
        </section>
    );
}