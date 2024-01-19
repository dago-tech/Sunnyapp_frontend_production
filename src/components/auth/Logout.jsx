import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../helpers/axios";
import { errorMessage } from "../../helpers/errorMessage";

export default function Logout() {
  /*Cerrar sesion de usuario y borrar tokens del cliente */
  
  const history = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    postData("/users/logout/blacklist/", {
      refresh_token: localStorage.getItem("refresh_token"),
    })
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        history("/home");
      })
      .catch((error) => {
        setError(errorMessage(error));
      });
  });

  return (
    <>
      {error && (
        <div className="center">
          <p className="error">{error}</p>
          <Link to="/home">Home</Link>
        </div>
      )}
    </>
  );
}
