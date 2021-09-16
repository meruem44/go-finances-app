import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Category, Icon } from "./styles";

interface CategorySelectedProps extends RectButtonProps {
  title: string;
}

export function CategorySelectedButton({
  title,
  ...rest
}: CategorySelectedProps) {
  return (
    <Container {...rest}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}
