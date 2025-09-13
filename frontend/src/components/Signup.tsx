import  { useEffect, useState } from "react";
import {Label} from './ui/label.js'
import {Button} from './ui/button.js'
import axios from 'axios'
import {toast}from 'sonner'
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
const Signup=()=>{
    const [input,setInput]=useState({
        username:"",
        email:"",
        password:""
    })
    const {user}=useSelector((store:any)=>store.auth)
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const changeEventHandler=(e:any)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const SignupHandler=async(e:any)=>{
        e.preventDefault()
        console.log("bk",e,input)
        try {
            setLoading(true)
            const res=await axios.post('https://connectapp-k6fs.onrender.com/api/v1/user/register',input,{
                headers:{
                    "Content-Type":'application/json'
                },
                withCredentials:true
            })
            if(res.data.success){
                navigate('/login')
                toast.success(res.data.message);
                setInput({
                    username:"",
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
                    <p className="tet-sm text-center">Signup to see photos & videos from your friends</p>
                </div>
                <div >
                   <Label className=" font-medium">username</Label>
                   <input type="text" onChange={changeEventHandler} name="username" value={input.username} className="w-fit border-4 focus-visible:ring-transparent my-2" />
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Please Wait
                            </Button>
                    ):
                    (
                <Button type="submit">Signup</Button>
            )
                }
                <span className="text-center">Already have an account? <Link to='/login' className="text-blue-600">Login</Link></span>
            </form>

        </div>
    )
}
export default Signup