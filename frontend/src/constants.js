export const login = "/loginRedirect";
export const token = "/get/token";

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
