import Posts from "./Posts.tsx";

const Feed = () => {
    return (
        // The container is now simplified. 'w-full' ensures it fills the space provided by the Home component.
        <div className="w-full flex flex-col items-center">
            <Posts />
        </div>
    );
}

export default Feed;