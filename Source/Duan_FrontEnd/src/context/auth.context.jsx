import { ThemeContext } from "@emotion/react";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenthicate: false,
  user: {
    email: "",
    name: "",
    role: "",
  },
});

export const AuthWarrper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenthicate: false,
    user: {
      email: "",
      name: "",
      role: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
