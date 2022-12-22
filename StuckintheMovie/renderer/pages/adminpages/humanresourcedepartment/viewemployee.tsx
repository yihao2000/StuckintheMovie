import React from "react";
import Head from "next/head";
// import LoadingButton from "../pages/additionalComponents/loadingbutton";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Link from "../../../components/Link";

import Table from "../../additionalComponents/tables/employeetable";

import {
  AppBar,
  Box,
  CssBaseline,
  Grid,
  Snackbar,
  TextField,
  Toolbar,
} from "@material-ui/core";

import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
} from "@firebase/firestore";
import { app, database } from "../../database/firebaseconfig";
import { comparePassword } from "../../utils/encryptor";
import Router from "next/router";
import { Alert } from "@material-ui/lab";
import secureLocalStorage from "react-secure-storage";
import { SideDrawer } from "../../additionalComponents/drawer/sidedrawer";
import PrimarySearchAppBar from "../../additionalComponents/appbar/customappbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      paddingTop: theme.spacing(4),
      minHeight: "100vh",
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      background: "#111416",
    },
    drawerPaper: {
      background: "#111416",
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,

      padding: theme.spacing(3),
    },
  })
);

const drawerWidth = 240;

function ViewEmployee() {
  const classes = useStyles({});

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript-material-ui)</title>
      </Head>
      <div className={classes.root}>
        <CssBaseline />
        <PrimarySearchAppBar></PrimarySearchAppBar>
        <SideDrawer />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", marginLeft: "20" }}
          >
            View Employees
          </Typography>
          <Box height={50}></Box>
          <Table />
        </main>
      </div>
    </React.Fragment>
  );
}
export default ViewEmployee;