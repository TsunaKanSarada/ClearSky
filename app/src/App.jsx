import { AuthProvider, useAuth } from "./providers/authproviders";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./components/header";
import Dashboard from "./components/dashboard";
import Footer from "./components/footer";
import Authpage from "./components/authpage";

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

function App() {
    return (
        <AuthProvider>
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
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
