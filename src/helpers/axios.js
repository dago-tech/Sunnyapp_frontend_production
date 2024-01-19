import axios from "axios";

/* Gestiona las solicitudes HTTP y del token de refresco */

const baseURL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "JWT " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
  },
});

// Función para realizar una solicitud GET
export const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

// Función para realizar una solicitud POST
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error in POST request:", error);
    throw error;
  }
};

// Función para realizar una solicitud DELETE
export const deleteData = async (endpoint) => {
  try {
    await api.delete(endpoint);
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};

/*Se usa la función interceptors para que se ejecute su codigo interno cada vez que
se recibe un response de HTTP en la instancia de axios*/

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    /*Si se presentan los siguientes errores terminar la promesa retornando el error */
    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/login/";
      return Promise.reject(error);
    }
    /* Si se presenta uno de los siguientes errores quiere decir que hay un problema
    con la autenticación. Si la fecha de expiración del refresh token ya pasó, se 
    redirige a la página de Login para iniciar sesión nuevamente; si no, automáticamente
    se solicitan nuevos tokens al backend y el usuario mantendrá su sesión */

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        /* Se decodifica informacion del payload en un objeto, metadata 
        como la fecha de expiración.
        atob decodifica un string base64-encoded*/
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // Redondeo de Date.now
        // exp date es expresada en segundos, now() retorna milisegundos
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return api
            .post("/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem("access_token", response.data.access);
              localStorage.setItem("refresh_token", response.data.refresh);

              api.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return api(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          //Redireccionando
          window.location.href = "/login/";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "/login/";
      }
    }

    // Si hay otra clase de error
    return Promise.reject(error);
  }
);

export default api;
