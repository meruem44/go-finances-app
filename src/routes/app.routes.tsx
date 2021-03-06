import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Dashboard } from "../pages/Dashboard";
import { Register } from "../pages/Register";
import { Resume } from "../pages/Resume";

import { Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors } = useTheme();

  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: colors.secundary,
        inactiveTintColor: colors.text,
        labelPosition: "beside-icon",
        style: {
          padding: Platform.OS === "ios" ? RFValue(20) : 0,
          height: RFValue(70),
        },
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              size={size}
              color={color}
              name="format-list-bulleted"
            />
          ),
        }}
      />
      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons size={size} color={color} name="attach-money" />
          ),
        }}
      />
      <Screen
        name="Resumo"
        component={Resume}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons size={size} color={color} name="pie-chart" />
          ),
        }}
      />
    </Navigator>
  );
}
