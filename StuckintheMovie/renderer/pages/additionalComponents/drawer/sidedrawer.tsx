import React from "react";
import {
  Collapse,
  createStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";

import DashboardIcon from "@material-ui/icons/Dashboard";
import Router from "next/router";
import PeopleIcon from "@material-ui/icons/People";
import secureLocalStorage from "react-secure-storage";
import { Interface } from "readline";
import ListIcon from "@material-ui/icons/List";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import WarningIcon from "@material-ui/icons/Warning";

const drawerWidth = 260;
var auth;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      display: "flex",
      paddingTop: theme.spacing(4),
    },
    buttonPadding: {
      paddingLeft: "10px",
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: "#181c20",
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
      backgroundColor: "#181414",
      padding: theme.spacing(3),
    },
  })
);

function redirect(id) {
  Router.push("/" + id);
}

function DashboardItem() {
  return (
    <ListItem button onClick={redirect.bind(this, "dashboard")}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText>Dashboard</ListItemText>
    </ListItem>
  );
}

function AdminDrawer() {
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleOpenSettings() {
    setOpenCollapse(!openCollapse);
  }

  var mainItems = [
    {
      destination: "manageemployee",
      text: "Manage Employee",
      icon: <PeopleIcon />,
    },
  ];

  var subItems = [
    {
      destination: "adminpages/viewemployee",
      text: "View Employee",
      icon: <ListIcon />,
    },
    {
      destination: "adminpages/warningletters",
      text: "Warning Letters",
      icon: <WarningIcon />,
    },
  ];
  return (
    <List>
      <DashboardItem></DashboardItem>
      {mainItems.map((e) => {
        return (
          <ListItem
            button
            key={e.destination}
            // {redirect.bind(this, e.destination)}
            onClick={handleOpenSettings}
          >
            <ListItemIcon>{e.icon}</ListItemIcon>
            <ListItemText>{e.text}</ListItemText>
            {openCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        );
      })}
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems.map((e) => {
            return (
              <ListItem
                key={e.destination}
                onClick={redirect.bind(this, e.destination)}
                button
                style={{
                  paddingLeft: "30px",
                }}
              >
                <ListItemIcon>{e.icon}</ListItemIcon>
                <ListItemText primary={e.text} />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
}

interface Auth {
  id: string;
  firsName: string;
  lastName: string;
  department: string;
  division: string;
}

export function SideDrawer() {
  const [valid, setValid] = React.useState(false);
  const [auth, setAuth] = React.useState(
    secureLocalStorage.getItem("credentials") as Auth
  );

  React.useEffect(() => {
    if (auth == null) {
      setAuth(secureLocalStorage.getItem("credentials") as Auth);
    }
    if (auth != null && auth.department === "2") {
      setValid(true);
    }
  }, []);

  const classes = useStyles({});
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <Divider />

      {valid && <AdminDrawer></AdminDrawer>}
    </Drawer>
  );
}
