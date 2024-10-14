import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { useMsal } from "@azure/msal-react";
import { GetRoles } from "../auth/api/authApi";

interface UserContextType {
  role: string;
  setRole: (role: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { accounts } = useMsal();
  useEffect(() => {
    const fetchData = async () => {
      const accountToken = accounts[0].idToken;
      const response = await GetRoles(accountToken);
      await setRole(response.roleName);
    };

    fetchData();
  }, []);
  const [role, setRole] = useState("");

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
