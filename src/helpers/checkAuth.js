import { getData } from "./axios";

export const checkAuthentication = async () => {
  /* Verifica la autenticación del usuario basado en el access token 
  Retorna si el usuario está autenticado y su email*/

  const accessToken = localStorage.getItem("access_token");
  const result = {
    authenticated: false,
    userEmail: "",
  };

  if (accessToken) {
    const tokenParts = JSON.parse(atob(accessToken.split(".")[1]));
    const now = Math.ceil(Date.now() / 1000);

    if (tokenParts.exp > now) {
      result.authenticated = true;
      const userEmail = await getData(
        `users/get_user_email/${tokenParts.user_id}/`
      );

      result.userEmail = userEmail;
      return result;
    } else {
      throw new Error(`Expired token`);
    }
  } else {
    throw new Error(`Auth Token not found`);
  }
};
