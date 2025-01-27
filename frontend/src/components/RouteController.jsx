import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // 型チェック
import { useAuth } from "../providers/authproviders";
// コンポーネント群
import Header from "../components/header";
import Dashboard from "../components/dashboard";
import Footer from "../components/footer";
import Authpage from "../components/authpage";

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth(); // 認証状態を取得
    if (!currentUser) { // 未認証時はログインページへ
        return <Navigate to="/" replace />;
    }
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

function RouteController() {
    return (
        <Router>
            <Routes>
                {/* パブリックルート：ログインページ */}
                <Route path="/" element={<Authpage />} />

                {/* プロテクトルート(要認証)：ホームページ */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <Dashboard />
                                <Footer />
                            </>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default RouteController;