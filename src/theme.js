import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0073e6', // Синий цвет для акцентов
    },
    secondary: {
      main: '#f50057', // Розовый для второстепенных акцентов
    },
    background: {
      default: '#f8f9fa', // Светлый фон, похожий на Notion
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Основной шрифт
  },
});

export default theme;