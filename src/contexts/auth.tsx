import React, { createContext, ReactNode, useContext } from "react";
import * as AuthSession from "expo-auth-session";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  async function signInWithGoogle() {
    try {
      console.log("chamou");
      const CLIENT_ID =
        "560709002222-km3vd1ju2q176tiu3o6sm9ur2srkl1l2.apps.googleusercontent.com";
      const REDIRECT_URI = "https://auth.expo.io/@lemoraes/gofinances";
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      console.log(authUrl);

      const response = await AuthSession.startAsync({ authUrl });
      console.log(response);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return (
    <AuthContext.Provider value={{ signInWithGoogle, user: {} as User }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthContext, AuthProvider, useAuth };
