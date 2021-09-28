import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useAuth } from "../../contexts/auth";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const { colors } = useTheme();
  const { signOut, user } = useAuth();

  const [data, setDate] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightDate] = useState<HighlightData>(
    {} as HighlightData
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "up" | "down" | "",
    total = false,
    allLast = undefined
  ) {
    let lastTransactions = new Date();

    if (type) {
      lastTransactions = new Date(
        Math.max.apply(
          Math,
          collection
            .filter((transaction: DataListProps) => transaction.type === type)
            .map((transactions: DataListProps) =>
              new Date(transactions.date).getTime()
            )
        )
      );
    }

    if (total && allLast) {
      const firstTransaction = new Date(
        Math.min.apply(
          Math,
          collection.map((transactions: DataListProps) =>
            new Date(transactions.date).getTime()
          )
        )
      );

      return `de ${firstTransaction.toLocaleString("pt-BR", {
        day: "numeric",
        month: "long",
      })} á ${new Date(allLast).toLocaleString("pt-BR", {
        day: "numeric",
        month: "long",
      })}`;
    }

    return lastTransactions.getTime();
  }

  async function loadTransactions() {
    setIsLoading(true);

    const dataKey = `@gofinance:transactions_user:${user.id}`;

    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormated: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        if (item.type === "up") {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        return {
          ...item,
          amount,
          date,
        };
      }
    );

    const lastTransactionEntries = getLastTransactionDate(transactions, "up");
    const lastTransactionExpensives = getLastTransactionDate(
      transactions,
      "down"
    );

    const isLast =
      lastTransactionEntries > lastTransactionExpensives
        ? lastTransactionEntries
        : lastTransactionExpensives;

    const totalInterval = getLastTransactionDate(
      transactions,
      "",
      true,
      isLast
    );

    const total = entriesTotal - expensiveTotal;

    setHighlightDate({
      entries: {
        total: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última entrada${new Date(
          lastTransactionEntries
        ).getDate()} de ${new Date(lastTransactionEntries).toLocaleString(
          "pt-BR",
          {
            month: "long",
          }
        )}`,
      },
      expensive: {
        total: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última saída${new Date(
          lastTransactionExpensives
        ).getDate()} de ${new Date(lastTransactionExpensives).toLocaleString(
          "pt-BR",
          {
            month: "long",
          }
        )}`,
      },
      total: {
        total: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });
    setDate(transactionsFormated);

    setIsLoading(false);
  }

  return (
    <Container>
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
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user?.photo,
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user?.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries?.total}
              lastTransaction={highlightData.entries?.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saída"
              amount={highlightData.expensive?.total}
              lastTransaction={highlightData.expensive?.lastTransaction}
            />

            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total?.total}
              lastTransaction={highlightData.total?.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
