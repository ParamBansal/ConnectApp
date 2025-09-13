
import Post from "./Post.tsx";
import { useSelector } from "react-redux";

const Posts = () => {
    const { posts } = useSelector((store:any) => store.post);

    console.log("posts", posts);

    if (!posts || posts.length === 0) {
        return <div>No posts available</div>;
    }

    return (
        <div>
          {posts.map((postt: any, i: number) => (
    postt ? <Post key={postt._id || i} post={postt} /> : null
))}

        </div>
    );
};

export default Posts;
