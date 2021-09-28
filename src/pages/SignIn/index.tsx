import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../contexts/auth";
import { useTheme } from "styled-components";
import { ActivityIndicator, Alert, Platform } from "react-native";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";

import { SignInSocialButton } from "../../components/SignInSocialButton";

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from "./styles";

export function SignIn() {
  const { colors } = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSignWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops, ocorreu um erro na sua autenticação",
        "Não foi possivél se conectar na conta Google"
      );
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error) {
      Alert.alert(
        "Ops, ocorreu um erro na sua autenticação",
        "Não foi possivél se conectar na conta Apple"
      );
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>
            Controle suas{"\n"}finanças de forma{"\n"}muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>Faça seu login com{"\n"}uma das contas abaixo</SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            onPress={handleSignWithGoogle}
            title="Entrar com Google"
            svg={GoogleSvg}
          />
          {Platform.OS === "ios" && (
            <SignInSocialButton
              onPress={handleSignInWithApple}
              title="Entrar com Apple"
              svg={AppleSvg}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            style={{ marginTop: RFValue(18) }}
            color={colors.shape}
            size="large"
          />
        )}
      </Footer>
    </Container>
  );
}
