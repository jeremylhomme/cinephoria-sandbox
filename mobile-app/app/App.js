import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./navigation/AppNavigator";
import { ToastProvider } from "react-native-toast-notifications";
import { initializeAuth } from "./redux/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <AppNavigator />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
