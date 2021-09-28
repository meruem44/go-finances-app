import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// const { CLIENT_ID, REDIRECT_URI } = process.env;

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
  signInWithApple(): Promise<void>;
  userStorageLoading: boolean;
  signOut(): Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const KEY = "@gofinances:user";

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  useEffect(() => {
    async function loadUserStorageDate() {
      const userStorage = await AsyncStorage.getItem(KEY);

      if (userStorage) {
        const userLogged = JSON.parse(userStorage);
        setUser(userLogged);
      }
      setUserStorageLoading(false);
    }
    loadUserStorageDate();
  }, []);

  async function signInWithGoogle() {
    try {
      const CLIENT_ID =
        "560709002222-5qa52a7aeal53s9rkqrer60o7818eo9p.apps.googleusercontent.com";
      const REDIRECT_URI = "https://auth.expo.io/@lemoraes/gofinances";
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      console.log(authUrl);

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      console.log(params.access_token);

      if (type === "success") {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
          )
          .then(async (response) => {
            const { data } = response;

            const userLogged = {
              id: data.id,
              email: data.email!,
              name: data.name,
              photo: data.picture,
            };

            setUser(userLogged);
            await AsyncStorage.setItem(KEY, JSON.stringify(userLogged));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&lenlength=1gth=1`;

        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(KEY, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async function signOut() {
    setUser({} as User);

    await AsyncStorage.removeItem(KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        signInWithGoogle,
        user,
        signInWithApple,
        userStorageLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthContext, AuthProvider, useAuth };
