// Dashboard.js
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
        <div className="flex flex-col items-center p-0">
          <img src="/images/AI.jpg" alt="Example" />
        </div>
      );
      
}
{/*          <p className="mb-2">こんにちは、{user.email} さん！</p>
    <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          >
            サインアウト
          </button>*/}
export default Dashboard;
