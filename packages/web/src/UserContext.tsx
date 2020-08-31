import React, { Dispatch } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  bookcases: readonly string[];
};

type Action = { type: "setUser"; payload: User };

let UserContext = React.createContext<User | null | undefined>(undefined);

let UserDispatchContext = React.createContext<Dispatch<Action> | undefined>(
  undefined
);

function userReducer(user: User | null, action: Action) {
  switch (action.type) {
    case "setUser":
      return action.payload;
    default:
      return user;
  }
}

export function useState() {
  let value = React.useContext(UserContext);

  if (value === undefined) {
    throw new Error(
      "UserContext.useState must be used within a UserContext.Provider"
    );
  }

  return value;
}

export function useDispatch() {
  let value = React.useContext(UserDispatchContext);

  if (value === undefined) {
    throw new Error(
      "UserContext.useDispatch must be used within a UserContext.Provider"
    );
  }

  return value;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: UserProviderProps) {
  let [state, dispatch] = React.useReducer(userReducer, null);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
