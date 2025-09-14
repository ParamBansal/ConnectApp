import jwt from 'jsonwebtoken';
const isAuthenticated=async (req,res,next) => {
    try {
        const token=req.cookies.token;
        console.log("🔥 Cookies received:", req.cookies);
        if(!token){
            console.log("🚨 No token found");
            return res.status(401).json({
                message:'User not authenticated',
                success:false
            });
        }
        const decode=await jwt.verify(token,process.env.SECRET_KEY);
        console.log("✅ Decoded JWT:", decode);
        if(!decode){
            return res.status(401).json({
                message:'Invalid Token',
                success:false
            });
        }
        req.id=decode.userId;
        next();
    } catch (error) {
        console.log(error);
        
    }
}
export default isAuthenticated