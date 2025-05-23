import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useChatStore } from "../store/chatStore";

interface AuthContextType {
  isAuthenticated: boolean;
  connect: () => void;
  disconnect: () => void;
  address: string | undefined;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  connect: () => {},
  disconnect: () => {},
  address: undefined
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { connectWallet, logout } = useChatStore();
  
  useEffect(() => {
    if (isConnected && address) {
      setIsAuthenticated(true);
      connectWallet(address);
    } else {
      setIsAuthenticated(false);
    }
  }, [isConnected, address, connectWallet]);
  
  const connect = () => {
  };
  
  const disconnect = () => {
    wagmiDisconnect();
    logout();
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      connect,
      disconnect,
      address
    }}>
      {children}
    </AuthContext.Provider>
  );
};