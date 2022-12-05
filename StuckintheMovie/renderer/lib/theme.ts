import { createTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

