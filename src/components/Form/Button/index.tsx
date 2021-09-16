import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Title } from "./styled";

interface ButtonProps extends RectButtonProps {
  title: string;
  onPress(): void;
}

export function Button({ title, onPress, ...rest }: ButtonProps) {
  return (
    <Container onPress={onPress} activeOpacity={0.8} {...rest}>
      <Title>{title}</Title>
    </Container>
  );
}
