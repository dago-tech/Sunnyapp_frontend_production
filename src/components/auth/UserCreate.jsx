import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postData } from "../../helpers/axios";
import { errorMessage } from "../../helpers/errorMessage";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/userCreate.css";
import BackButton from "../BackButton";

export function UserCreate() {
  /* Formulario para la creación de un nuevo usuario */

  const endpoint = "users/create/";
  const history = useNavigate();

  const initialdata = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  };

  const [data, setData] = useState(initialdata);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      data.email == "" ||
      data.first_name == "" ||
      data.last_name == "" ||
      data.password == ""
    ) {
      setError("¡You did not fill out all the fields!");
      return;
    }
    // Se limpia el registro de errores si no los hay
    setError("");

    postData(endpoint, data)
      .then(() => {
        setMessage("¡ User created successfully !");
        const timer = setTimeout(() => {
          history("/home");
        }, 2000);
      })
      .catch((error) => {
        setError(errorMessage(error));
      });
  };

  const handleReset = () => {
    setData(initialdata);
    setError("");
  };

  const togglePasswordVisibility = () => {
    // Maneja la visibilidad de la contraseña
    setShowPassword(!showPassword);
  };

  return (
    <>
      <BackButton />
      <div className="create-user-container">
        <h1 className="create-edit-title">Create a new account</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="first_name">First name: </label>
          <input
            type="text"
            name="first_name"
            placeholder="First name"
            onChange={handleChange}
            value={data.first_name}
          />
          <label htmlFor="last_name">Last name: </label>
          <input
            type="text"
            name="last_name"
            placeholder="Last name"
            onChange={handleChange}
            value={data.last_name}
          />
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={data.email}
          />
          <label htmlFor="password">Password:</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            <span onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
          <button type="button" onClick={handleReset}>
            Clear
          </button>
        </form>
        {message && <p style={{ fontWeight: "bold" }}>{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}
