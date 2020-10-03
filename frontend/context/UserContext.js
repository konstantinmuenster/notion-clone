import { createContext, useReducer, useEffect } from "react";

export const UserStateContext = createContext();
export const UserDispatchContext = createContext();

// const initialState = {
//   isAuth: false,
// };

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        isAuth: true,
      };
    }
    case "LOGOUT": {
      return {
        isAuth: false,
      };
    }
    default: {
      throw new Error("Unhandled action type.");
    }
  }
};

const UserProvider = ({ children, isAuthenticated }) => {
  const [state, dispatch] = useReducer(reducer, { isAuth: isAuthenticated });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: "LOGIN" });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, [isAuthenticated]);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export default UserProvider;
