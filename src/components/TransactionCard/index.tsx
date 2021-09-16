import React from "react";
import { categories } from "../../utils/categories";

import {
  Container,
  Title,
  Amount,
  Content,
  Category,
  Icon,
  CategoryName,
  Date,
} from "./styles";

export interface TransactionCardProps {
  type: "up" | "down";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard({
  data: { name, amount, category, date, type },
}: Props) {
  const categoryKey = categories.filter((item) => item.key === category)[0];

  console.log(type, "typetype")

  return (
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>
        {type === "down" && "- "} {amount}
      </Amount>

      <Content>
        <Category>
          <Icon name={categoryKey.icon} />
          <CategoryName>{categoryKey.name}</CategoryName>
        </Category>

        <Date>{date}</Date>
      </Content>
    </Container>
  );
}
