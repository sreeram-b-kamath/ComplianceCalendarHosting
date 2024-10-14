import "./App.css";
import Layout from "./routes/Layout/Layout";
import Login from "./components/Login/Login";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { UserProvider } from "./context/UserContext";
import Navbar from "./sharedcomponents/Navigation/Navbar";

function App() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  return (
    <>
      <AuthenticatedTemplate>
        {activeAccount ? (
          <>
            <UserProvider>
         <Navbar/>
            <Layout />

            </UserProvider>
    
          </>
        ) : null}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <>
          <Login />
        </>
      </UnauthenticatedTemplate>

    </>
  );
}

export default App;
