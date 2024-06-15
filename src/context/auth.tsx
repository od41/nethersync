import React, { useEffect, createContext } from "react";

export const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    async function openOAuthPopup() {
      const response = await fetch("/api/auth/session-token");
      const data = await response.json();
      const sessionToken = data.data.sessionToken;

      //   if (!window) return;

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
        },
        false
      );
    }

    openOAuthPopup();
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
