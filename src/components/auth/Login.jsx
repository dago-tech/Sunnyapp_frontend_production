import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../helpers/axios";
import { errorMessage } from "../../helpers/errorMessage";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/login.css";

const Login = () => {
  /*Formulario de login, al hacer login exitoso se reciben los access
  y refresh token del Backend */

  const history = useNavigate();
  const initialData = {
    email: "",
    password: "",
  };

  const [data, updateData] = useState(initialData);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    updateData({
      ...data,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = () => {
    if (data.email == "" || data.password == "") {
      setError("¡You did not fill out all the fields!");
      return;
    }
    // Se limpia el registro de errores si no los hay
    setError("");

    postData("token/", {
      email: data.email,
      password: data.password,
    })
      //Obtiene los dos token y los guarda en el localStorage
      .then((response) => {
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);

        history("/graph");
      })
      .catch((error) => {
        setError(errorMessage(error));
      });
  };

  const togglePasswordVisibility = () => {
    // Maneja la visibilidad de la contraseña
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login-container">
        <h1>SunnyApp</h1>
        <h3>LOGIN</h3>

        <div className="logo-container">
          <img src="/login.png" alt="User Logo" />
        </div>

        <form className="login-form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={data.email}
            autoComplete="email"
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={data.password}
              autoComplete="current-password"
              onChange={handleChange}
              required
            />
            <span onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="button" onClick={handleSubmit}>
            Login
          </button>
        </form>

        <div className="register-link">
          <a href="/register">Create a new account</a>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default Login;
