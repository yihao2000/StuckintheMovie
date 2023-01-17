import { createTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';



export const theme = createTheme({

  //Initial, cursive, revert, revert-layer
  typography:{
    "fontFamily": "helvetica",
    "fontWeightBold": "bold"
  },
  palette: {

    primary: {
      main: '#F79A1F',
      contrastText: "FFFFFF"
    },
    secondary: {
      main: '#EB4F47',

    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },

});

