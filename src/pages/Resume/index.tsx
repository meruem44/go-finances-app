import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { useFocusEffect } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { HistoryCard } from "../../components/HistoryCard";

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MouthSelect,
  MonthSelectButton,
  SelectIcon,
  Mounth,
  LoadContainer,
} from "./styles";
import { categories } from "../../utils/categories";
import { RFValue } from "react-native-responsive-fontsize";
import { ActivityIndicator } from "react-native";

export interface Transaction {
  type: "up" | "down";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  name: string;
  total: number;
  totalFormated: string;
  color: string;
  percentage: string;
}

export function Resume() {
  const { colors, fonts } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [totalByCategories, setTotalByCategoris] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);

    const dataKey = "@gofinance:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response
      ? JSON.parse(response)
      : ([] as Transaction[]);

    const expensives = transactions.filter(
      (transaction: Transaction) =>
        transaction.type === "down" &&
        new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensivesTotal = expensives.reduce(
      (acumulator: number, expensive: Transaction) => {
        return acumulator + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: Transaction) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const percentage = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          name: category.name,
          totalFormated: categorySum.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          color: category.color,
          total: categorySum,
          percentage,
        });
      }
    });

    setTotalByCategoris(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: RFValue(10),
          paddingBottom: useBottomTabBarHeight(),
        }}
      >
        <MouthSelect>
          <MonthSelectButton onPress={() => handleChangeDate("prev")}>
            <SelectIcon name="chevron-left" />
          </MonthSelectButton>

          <Mounth>
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </Mounth>

          <MonthSelectButton onPress={() => handleChangeDate("next")}>
            <SelectIcon name="chevron-right" />
          </MonthSelectButton>
        </MouthSelect>

        {isLoading && (
          <LoadContainer>
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color={colors.primary}
            />
          </LoadContainer>
        )}

        {!isLoading && (
          <>
            <ChartContainer>
              <VictoryPie
                colorScale={totalByCategories.map((category) => category.color)}
                data={totalByCategories}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fontFamily: fonts.bold,
                    fill: colors.shape,
                  },
                }}
                labelRadius={50}
                x="percentage"
                y="total"
              />
            </ChartContainer>

            {totalByCategories.map((item) => (
              <HistoryCard
                key={item.name}
                title={item.name}
                amount={item.totalFormated}
                color={item.color}
              />
            ))}
          </>
        )}
      </Content>
    </Container>
  );
}
