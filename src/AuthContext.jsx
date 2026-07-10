import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";
// The locations, add to here if addinig another location
const LOCATIONS = { gate: "GATE", tablet: "TABLET", tunnel: "TUNNEL" };
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState(LOCATIONS.gate);

  // TODO: signup
  async function signup(username) {
    try {
      const req = await fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const result = await req.json();
      if (req.ok) {
        setToken(result.token);
        setLocation(LOCATIONS.tablet);
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }
  // TODO: authenticate
  async function authenticate() {
    try {
      if (!token) throw Error("No token");
      const req = await fetch(API + "/authenticate", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      });
      if (req.ok) setLocation(LOCATIONS.tunnel);
    } catch (e) {
      console.log(e);
    }
  }

  const value = { location, authenticate, signup };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
