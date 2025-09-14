import Post from "./Post.tsx";
import { useSelector } from "react-redux";

const Posts = () => {
    const { posts } = useSelector((store: any) => store.post);

    // This logic is unchanged
    if (!posts || posts.length === 0) {
        // --- STYLED EMPTY STATE ---
        return (
            <div className="text-center text-muted-foreground mt-16 px-4">
                <h2 className="text-2xl font-semibold text-foreground">No Posts Yet</h2>
                <p className="mt-2">Follow people to see their posts in your feed.</p>
            </div>
        );
    }

    return (
        // This container adds consistent vertical space between each Post component
        <div className="w-full space-y-8">
            {posts.map((postt: any, i: number) => (
                postt ? <Post key={postt._id || i} post={postt} /> : null
            ))}
        </div>
    );
};

export default Posts;