import { AuthProvider } from "./providers/authproviders";
import RouteController from "./RouteController";

function App() {
    return (
        <AuthProvider>
            <RouteController />
        </AuthProvider>
    );
}

export default App;