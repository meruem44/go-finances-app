import React, { useState } from "react";
import * as Yup from "yup";
import { NavigationProp } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useAuth } from "../../contexts/auth";

import { useForm } from "react-hook-form";

import { Alert, Keyboard, Modal } from "react-native";
import { Button } from "../../components/Form/Button";
import { CategorySelectedButton } from "../../components/Form/CategorySelectedButton";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";

import { CategorySelect } from "../CategorySelect";

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TrasactionType,
  TouchableWithoutFeedback,
} from "./styles";

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number()
    .typeError("Informe um valor númerico")
    .positive("O valor não pode ser negativo")
    .required("Valor é obrigatório"),
});

interface RegisterProps {
  navigation: NavigationProp<{}>;
}

export function Register({ navigation }: RegisterProps) {
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  function handleTransactionTypeSelect(type: "up" | "down") {
    setTransactionType(type);
  }

  function handleCloseCategorySelectModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenCategorySelectModal() {
    setCategoryModalOpen(true);
  }

  // useEffect(() => {
  //   async function remove() {
  //     await AsyncStorage.removeItem("@gofinance:transactions");
  //   }
  //   remove();
  // }, []);

  async function handleRegister({ name, amount }: FormData) {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação");
    if (category.key === "category")
      return Alert.alert("Ops", "Selecione a categoria");

    const newTransaction = {
      id: String(uuid.v4()),
      name,
      amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const dataKey = `@gofinance:transactions_user:${user.id}`;

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormated = [...currentData, newTransaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });

      reset();
      navigation.navigate("Listagem" as never);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops, ocorreu um erro",
        "Não foi possível salvar a transação."
      );
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name?.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.name && errors.amount?.message}
            />

            <TrasactionType>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionTypeSelect("up")}
                isActive={transactionType === "up"}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionTypeSelect("down")}
                isActive={transactionType === "down"}
              />
            </TrasactionType>

            <CategorySelectedButton
              onPress={handleOpenCategorySelectModal}
              title={category.name}
            />
          </Fields>
          <Button onPress={handleSubmit(handleRegister)} title="Enviar" />
        </Form>

        <Modal
          animationType="slide"
          onRequestClose={handleCloseCategorySelectModal}
          visible={categoryModalOpen}
        >
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseCategorySelectModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
