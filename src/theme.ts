import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6C5BD4" },
    secondary: { main: "#FF6000" },
    background: {
      default: "#242424",
      paper: "#111111",
    },
  },
  typography: {
    fontFamily: "Manrope, Clash Display, sans-serif",
  },
});

export default theme;
