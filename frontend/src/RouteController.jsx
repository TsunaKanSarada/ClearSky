// RouteController.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "./providers/authproviders";
import Header from "./components/header";
import Dashboard from "./components/home/animation";
import Comment from "./components/home/comment";
import ChatFlow from "./components/home/ChatFlow";
import Footer from "./components/footer";
import Authpage from "./components/authpage";
import Info from "./components/info/info"; 
import AIcomment from "./components/info/AIcomment";
import Chat from "./components/playroom/playroom";
import Subscribe from "./components/subscribe"; 
import Firstlogin from "./components/firstlogin"; 

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
    const data = {
        "":100,
        "就職活動を成功させるためには、まず自己分析が不可欠です。自身の強みや価値観を明確にすることで、適切な企業選びや効果的な自己PRが可能となります。過去の経験を振り返り、自分の特性を深く理解しましょう。": 1,
        "企業は新しいことに積極的に挑戦する人材を求めています。自己PRでは、具体的なエピソードを交えて、どのように困難を乗り越え、成長してきたかを伝えると効果的です。例えば、留学やボランティア活動など、新しい環境での経験を強調しましょう。 ": 2,
        "分かりやすい文章を書くためには、一文を短くし、主語と述語の関係を明確にすることが大切です。また、話題を一つに絞り、論理的な流れを意識しましょう。読み手の立場に立って、伝わりやすい表現を心掛けることが重要です。": 0,
        "面接では、自分の長所と短所を適切に伝えることが求められます。長所は具体的なエピソードとともに述べ、短所はそれをどのように克服しようとしているかを説明すると良いでしょう。これにより、自己理解と成長意欲をアピールできます。": 2,
        "面接では、明るくハキハキとした話し方を意識しましょう。語尾までしっかりと発音し、適度な抑揚をつけることで、面接官に自信と熱意を伝えることができます。また、目を見て話すことで、誠実さやコミュニケーション能力をアピールできます。": 5,
      };
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
                                <ChatFlow data={data} />
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
                                <AIcomment />
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
                <Route
                    path="/test"
                    element={
                        <Subscribe />
                    }
                />
                <Route
                    path="/test2"
                    element={
                        <Firstlogin />
                    }
                />
            </Routes>
        </Router>
    );
}

export default RouteController;
