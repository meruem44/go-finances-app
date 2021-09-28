import "react-native-gesture-handler";

import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";

import { StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";

import { AuthProvider, useAuth } from "./src/contexts/auth";
import { Routes } from "./src/routes";
import { Dashboard } from "./src/pages/Dashboard";

export default function App() {
  const { userStorageLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <StatusBar
          backgroundColor={theme.colors.primary}
          barStyle="light-content"
        />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
