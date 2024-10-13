import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../services/getAuth";
import classes from "./Login.module.scss";

interface LoginFormData {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const { username, password } = formData;
      const response = await getAuth(username, password);
      console.info(response);
      navigate("/orders");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  }, [formData, navigate]);

  return (
    <div className={classes.Login}>
      <div className={classes.Login__container}>
        <h1 className={classes.Login__title}>Platz order</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          className={classes.Login__input}
        />
        <div className={classes.Login__passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className={classes.Login__input}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={classes.Login__togglePassword}
          >
            {showPassword ? "hide" : "show"}
          </button>
        </div>
        {errorMessage && (
          <p className={classes.Login__errorMsg}>{errorMessage}</p>
        )}
        <button className={classes.Login__cta} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};
