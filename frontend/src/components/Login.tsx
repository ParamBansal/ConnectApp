import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { setAuthUser } from "@/redux/authSlice";
import { Input } from "./ui/input"; // Assuming a styled Input component exists

const Login = () => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const { user } = useSelector((store: any) => store.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e: any) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const SignupHandler = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
                setInput({
                    password: "",
                    email: ""
                });
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);

    return (
        // --- ALL STYLING CHANGES ARE BELOW ---
        <div className='flex items-center justify-center w-screen h-screen bg-background text-foreground p-4'>
            <main className="w-full max-w-md">
                <form onSubmit={SignupHandler} className="bg-card border border-border rounded-2xl shadow-lg flex flex-col gap-6 p-6 sm:p-8">

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="font-bold text-3xl text-foreground">Connect</h1>
                        <p className="text-sm text-muted-foreground mt-2">Login to see photos & videos from your friends.</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold text-foreground">Email</Label>
                            <Input 
                                id="email"
                                type="email" 
                                onChange={changeEventHandler} 
                                name="email" 
                                value={input.email} 
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password</Label>
                            <Input 
                                id="password"
                                type="password" 
                                onChange={changeEventHandler} 
                                name="password" 
                                value={input.password} 
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3">
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>

                    {/* Footer Link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to='/signup' className="text-primary font-semibold hover:underline">
                            Signup
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    );
};

export default Login;