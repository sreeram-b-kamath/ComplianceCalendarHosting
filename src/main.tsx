import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { useAuthProvider } from "./auth/hooks/auth-provider.tsx";

// eslint-disable-next-line react-hooks/rules-of-hooks
const { AuthProvider } = useAuthProvider();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        {/* Add your app components here */}
        <App />
      </AuthProvider>
     
    </BrowserRouter>
  </>
);
