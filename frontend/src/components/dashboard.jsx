import { signOutUser } from "../service/auth";
import { useState, useEffect } from "react";
import { auth } from "../service/firebase";

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const handleSignOut = async () => {
        try {
            await signOutUser();
        } catch (error) {
            alert(`FAILED SIGNOUT: ${error.message}`);
        }
    };

    if (!user) return null;

    return (
        <div className="home-container">
            <h1>ホーム画面</h1>
            <p>こんにちは、{user.email} さん！</p>
            <button onClick={handleSignOut} className="button signout">
                サインアウト
            </button>
        </div>
    );
}

export default Dashboard;