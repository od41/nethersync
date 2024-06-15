import React, { useEffect, createContext, useState } from "react";

export type UserProps = {
  email: string | undefined;
};

type AuthTypeProps = {
  signIn: () => void;
  sessionId: string | undefined;
  user: UserProps | undefined;
};
const defaultProps: AuthTypeProps = {
  signIn: () => {},
  sessionId: undefined,
  user: undefined,
};

export const AuthContext = createContext(defaultProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionId] = useState();
  const [user, setUser] = useState<UserProps>();

  const signIn = async () => {
    const response = await fetch("/api/auth/session-token");
    const data = await response.json();
    const sessionToken = data.data.sessionToken;

    const oAuthWindow = window.open(
      `https://oauth.apillon.io/?embedded=1&token=${sessionToken}`,
      "Apillon OAuth Form",
      "height=900,width=450,resizable=no"
    );

    window.addEventListener(
      "message",
      async (event) => {
        if (!event.origin.includes("apillon.io")) return;

        if (!event.data.verified) {
          throw new Error("Invalid OAuth verification");
        }
        oAuthWindow!.close();

        const verifyResponse = await fetch("/api/auth/verify-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: event.data.authToken }),
        });

        const verifyData = await verifyResponse.json();
        console.log("User email:", verifyData.data.email);
        setUser({ email: verifyData.data.email });
      },
      false
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
