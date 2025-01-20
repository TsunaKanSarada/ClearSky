import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail, signInWithEmail, signInWithGoogle, signOutUser } from "../service/auth";
import "./page.css"

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
        <div className="app">
            <div className="container">
                <h1>Authentication</h1>
                <div className="form">
                    <input
                        type="email"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="button-group">
                    <button onClick={handleSignUp} className="button signup">
                        サインアップ
                    </button>
                    <button onClick={handleSignIn} className="button signin">
                        サインイン
                    </button>
                    <button onClick={handleGoogleSignIn} className="button google">
                        Google サインイン
                    </button>
                    <button onClick={handleSignOut} className="button signout">
                        サインアウト
                    </button>
                </div>
                {user && (
                    <div className="user-info">
                        <h3>ログイン中のユーザー:</h3>
                        <p>UID: {user.uid}</p>
                        <p>Email: {user.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Authpage;
