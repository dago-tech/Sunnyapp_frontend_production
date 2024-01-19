import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  /*Botón para retroceder de interfaz */
  const history = useNavigate();

  const handleClick = () => {
    history(-1);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#2a6968",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <IconButton onClick={handleClick} color="primary" aria-label="back">
        <ArrowBackIcon />
      </IconButton>
    </ThemeProvider>
  );
};

export default BackButton;
