
import { Avatar,AvatarFallback,AvatarImage } from "./ui/avatar.tsx";
const Comment=({comment}:any)=>{
   
    return (
        
        <div className="my-8 flex items-start gap-2">
  <Avatar>
    <AvatarImage src={comment?.author.profilePicture} />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  
  <div>
    <h1 className="font-bold text-sm">
      {comment?.author.username}
      <span className="font-normal pl-2">{comment?.text}</span>
    </h1>
  </div>
</div>

    )
}

export default Comment