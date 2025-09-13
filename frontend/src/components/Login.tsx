import  { useEffect, useState } from "react";
import {Label} from './ui/label.js'
import {Button} from './ui/button.js'
import axios from 'axios'
import {toast}from 'sonner'
import { Link,useNavigate } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice.ts";
const Login=()=>{
    const [input,setInput]=useState({
       
        email:"",
        password:""
    })
    const {user}=useSelector((store:any)=>store.auth)
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const changeEventHandler=(e:any)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const SignupHandler=async(e:any)=>{
        e.preventDefault()
        console.log("bk",e,input)
        try {
            setLoading(true)
            const res=await axios.post('http://localhost:8000/api/v1/user/login',input,{
                headers:{
                    "Content-Type":'application/json'
                },
                withCredentials:true
            })
            if(res.data.success){
                dispatch(setAuthUser(res.data.user))
                navigate('/')
                toast.success(res.data.message);
                setInput({
                
                    password:"",
                    email:""
                })
            }
        } catch (error:any) {
            console.log(error);
            toast.error(error.response.data.message)
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[])
    return(
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={SignupHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="my-4">
                    <h1 className="text-center font-bold text-xl">Logo</h1>
                    <p className="tet-sm text-center">Login to see photos & videos from your friends</p>
                </div>
             
                <div >
                   <Label className=" font-medium">email</Label>
                   <input type="email" onChange={changeEventHandler} name="email" value={input.email} className="w-fit border-4 focus-visible:ring-transparent my-2" />
                </div>
                <div >
                   <Label className=" font-medium">password</Label>
                   <input type="password" onChange={changeEventHandler} name="password" value={input.password} className="w-fit border-4 focus-visible:ring-transparent my-2" />
                </div>
                {
                    loading?(
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please wait
                        </Button>
                    ):(
                    <Button type="submit" className="w">Login</Button>
                    )
                }
                
                <span className="text-center">Don't have an account? <Link to='/signup' className="text-blue-600">Signup</Link></span>
            </form>

        </div>
    )
}
export default Login