import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail, signInWithEmail, signInWithGoogle, signOutUser } from "../service/auth";
import "../index.css"

const Authpage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate()
    const handleHome = () => {
        navigate('/Home')
    }

    const handleSignUp = async () => {
        try {
            const newUser = await signUpWithEmail(email, password);
            setUser(newUser);
            handleHome();
        } catch (error) {
            alert(`FAILED SIGNUP: ${error.message}`);
        }
    };

    const handleSignIn = async () => {
        try {
            const loggedInUser = await signInWithEmail(email, password);
            setUser(loggedInUser);
            console.log(user)
            handleHome();
        } catch (error) {
            alert(`FAILED SIGNIN: ${error.message}`);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const googleUser = await signInWithGoogle();
            setUser(googleUser);
            handleHome();
        } catch (error) {
            alert(`FAILED SIGNIN WITH GOOGLE: ${error.message}`);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOutUser();
            setUser(null);
        } catch (error) {
            alert(`FAILED SIGNOUT: ${error.message}`);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={handleSignIn}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Start a 14 day free trial
                        </a>
                    </p>

                    <div className="button-group">
                        <button onClick={handleSignUp} className="button signup">
                            サインアップ
                        </button>
                        <button onClick={handleGoogleSignIn} className="button google">
                            Google サインイン
                        </button>
                        <button onClick={handleSignOut} className="button signout">
                            サインアウト
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Authpage;
