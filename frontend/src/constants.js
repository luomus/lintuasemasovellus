export const login = "/loginRedirect";

/*
* Node's environment variables are available while running
* the development server.
*/
export const loginUrl = process.env.NODE_ENV === "development"
  ? `http://localhost:5000${login}`
  : login;
