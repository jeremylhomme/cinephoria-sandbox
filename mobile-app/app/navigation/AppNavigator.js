import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import OrdersScreen from "../screens/OrdersScreen";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator>
      {userInfo ? (
        <Stack.Screen name="Orders" component={OrdersScreen} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
