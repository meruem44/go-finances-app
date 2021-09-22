import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../contexts/auth";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import FacebookSvg from "../../assets/facebook.svg";
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
import { Alert } from "react-native";

export function SignIn() {
  const { signInWithGoogle } = useAuth();

  async function handleSignWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops, ocorreu um erro na sua autenticação",
        "Não foi possivél se conectar na conta Google"
      );
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
          <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}
