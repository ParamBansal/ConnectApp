import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input'; // Assuming a styled Input component exists
import { Loader2 } from "lucide-react";

const Signup = () => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const { user } = useSelector((store: any) => store.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e: any) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const SignupHandler = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
                setInput({
                    username: "",
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
                        <h1 className="font-bold text-3xl text-foreground">Create an Account</h1>
                        <p className="text-sm text-muted-foreground mt-2">Join to see photos & videos from your friends.</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                onChange={changeEventHandler}
                                name="username"
                                value={input.username}
                                placeholder="Choose a unique username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                onChange={changeEventHandler}
                                name="password"
                                value={input.password}
                                placeholder="Create a strong password"
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
                            'Signup'
                        )}
                    </Button>
                    
                    {/* Footer Link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to='/login' className="text-primary font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    );
};

export default Signup;