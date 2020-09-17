export const login = "/loginRedirect";
export const token = "/get/token";
export const logout = "/logout";

/*
* Node's environment variables are available while running
* the development server.
*/
export const loginUrl = process.env.NODE_ENV === "development"
  ? `http://localhost:5000${login}`
  : login;

export const authUrl = process.env.NODE_ENV === "development"
  ? `http://localhost:5000${token}`
  : token;

export const logoutUrl = process.env.NODE_ENV === "development"
  ? `http://localhost:5000${logout}`
  : logout;
