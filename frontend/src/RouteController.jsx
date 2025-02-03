// RouteController.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "./providers/authproviders";
import Header from "./components/header";
import Dashboard from "./components/home/dashboard";
import Footer from "./components/footer";
import Authpage from "./components/authpage";
import Info from "./components/info/info"; // Infoコンポーネントをインポート
import Chat from "./components/chat/chat";       // Chatコンポーネントをインポート

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser) {
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
                <Route path="/" element={<Authpage />} />
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
                <Route
                    path="/info"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <Info />
                                <Footer />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <Chat />
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
