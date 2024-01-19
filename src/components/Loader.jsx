import React from "react";
import "../styles/loader.css";

const Loader = () => {
  /* Contenedores usados para renderizar una animación redonda de carga de datos */
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
