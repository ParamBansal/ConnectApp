import  { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
interface ProtectedRoutesProps {
    children: React.ReactNode;
  }
const ProtectedRoutes=({children}:ProtectedRoutesProps)=>{
    const {user}=useSelector((store:any)=>store.auth);
    const navigate=useNavigate()
    useEffect(()=>{
        if(!user){
            navigate('/login')
        }
    },[])
    return (
        <>
        {children}</>
    )
}
export default ProtectedRoutes