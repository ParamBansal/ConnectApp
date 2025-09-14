import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";

const Comment = ({ comment }: any) => {
    return (
        // Removed 'my-8' as spacing is handled by the parent. Increased gap for better visuals.
        <div className="flex items-start gap-3">
            <Link to={`/profile/${comment?.author?._id}`}>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment?.author.profilePicture} />
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground font-semibold">
                        {comment?.author?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </Link>

            {/* Changed h1 to p for correct semantics */}
            <p className="text-sm text-foreground">
                <Link to={`/profile/${comment?.author?._id}`} className="font-semibold hover:underline">
                    {comment?.author.username}
                </Link>
                <span className="ml-2 font-normal text-muted-foreground">{comment?.text}</span>
            </p>
        </div>
    );
};

export default Comment;