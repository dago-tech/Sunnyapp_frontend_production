export const errorMessage = (error) => {
  /* Maneja los diferentes tipos de error para ser mostrados en la interfaz del cliente 
  Retorna el mensaje de error*/

  let message = "";

  if (error.response) {
    /* Guarda la propiedad data, la cual siempre se encuentra en el error cuando 
    hay un response*/
    const responseData = error.response.data;

    // Verifica si'responseData' es un array y si tiene al menos un elemento
    if (Array.isArray(responseData) && responseData.length > 0) {
      // Toma el primer elemento como mensaje
      message = responseData[0];
    } else if (typeof responseData === "string") {
      if (responseData.startsWith("<!DOCTYPE")) {
        //Si el error es un HTML
        message = error.message;
      } else {
        message = responseData;
      }
    } else if (typeof responseData === "object") {
      // Encuentra la primera propiedad dentro de 'responseData' que sea array o string
      const errorProperty = Object.keys(responseData).find(
        (propiedad) =>
          Array.isArray(responseData[propiedad]) ||
          typeof responseData[propiedad] === "string"
      );

      if (errorProperty !== undefined) {
        if (Array.isArray(responseData[errorProperty])) {
          //Si es un array
          const errorKey = errorProperty;
          const errorKeyCapitalized =
            errorKey.charAt(0).toUpperCase() + errorKey.slice(1);

          message = `${errorKeyCapitalized}: ${responseData[errorProperty][0]}`;
        } else {
          message = responseData[errorProperty];
        }
      } else {
        message = `Error: ${error.message}`;
      }
    } else {
      message = error.message || "System error";
    }
  }

  return message;
};
