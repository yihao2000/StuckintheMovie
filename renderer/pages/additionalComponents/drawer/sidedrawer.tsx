import React from "react";
import {
  Box,
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
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import WorkIcon from "@material-ui/icons/Work";
import Link from "next/link";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StorageIcon from "@material-ui/icons/Storage";
import DescriptionIcon from "@material-ui/icons/Description";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import MailOutline from "@material-ui/icons/MailOutline";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import CameraRollIcon from "@material-ui/icons/CameraRoll";
import ReportIcon from "@material-ui/icons/Report";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Report from "@material-ui/icons/Report";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PaymentIcon from "@material-ui/icons/Payment";

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
      background: "#F79A1F",
    },
    drawerPaper: {
      background: "#e6e6e6",
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,

    content: {
      flexGrow: 1,
      backgroundColor: "#f1faee",
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

function OperationDrawer(auth) {
  var array = [];
  React.useEffect(() => {
    if (auth.auth["department"] != "3") {
      array.push({
        destination: "adminpages/fundrequest",
        text: "Fund Request",
        icon: <AttachMoneyIcon />,
      });
    }

    if (auth.auth["department"] == "3") {
      array.push(
        {
          destination:
            "adminpages/accountingnfinancedepartment/managefundrequest",
          text: "Manage Fund",
          icon: <AttachMoneyIcon></AttachMoneyIcon>,
        },
        {
          destination:
            "adminpages/accountingnfinancedepartment/salaryadjustmentrequest",
          text: "Salary Adjustment Request",
          icon: <PaymentIcon />,
        }
      );
    } else if (auth.auth["department"] == "4") {
      console.log("Masuk");

      array.push({
        destination: "adminpages/storagedepartment/manageinventory",
        text: "Manage Inventory",
        icon: <StorageIcon />,
      });
    } else if (auth.auth["department"] == "6") {
      array.push({
        destination: "adminpages/promotioneventdepartment/managepromotionevent",
        text: "Promotion & Event",
        icon: <CardGiftcardIcon />,
      });
    } else if (auth.auth["department"] == "9") {
      array.push({
        destination: "adminpages/administratordepartment/manageemployeeaccount",
        text: "Manage Employee Account",
        icon: <SupervisorAccountIcon />,
      });
    }

    auth.auth["department"] != "4"
      ? array.push({
          destination: "adminpages/inventoryreport",
          text: "Report Inventory Issue",
          icon: <ReportIcon />,
        })
      : array.push({
          destination: "adminpages/storagedepartment/manageinventoryreport",
          text: "Manage Inventory Report",
          icon: <ReportIcon />,
        });

    setSubItems(array);
  }, [auth]);
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleOpenSettings() {
    setOpenCollapse(!openCollapse);
  }

  var mainItems = [
    {
      destination: "",
      text: "Operations",
      icon: <WorkIcon />,
    },
  ];

  const [subItems, setSubItems] = React.useState([]);
  return (
    <List>
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

function SelfServiceDrawer() {
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleOpenSettings() {
    setOpenCollapse(!openCollapse);
  }

  var mainItems = [
    {
      destination: "",
      text: "Self Service",
      icon: <PersonIcon />,
    },
  ];

  var subItems = [
    {
      destination: "adminpages/personalleave",
      text: "Personal Leave",
      icon: <ExitToAppIcon />,
    },
    {
      destination: "adminpages/resignationletter",
      text: "Resignation Letter",
      icon: <MailOutline />,
    },
  ];
  return (
    <List>
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

function ExternalDrawer() {
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleOpenSettings() {
    setOpenCollapse(!openCollapse);
  }

  var mainItems = [
    {
      destination: "manageemployee",
      text: "Relationships",
      icon: <PeopleAltIcon />,
    },
  ];

  var subItems = [
    {
      destination: "adminpages/externaldepartment/managemovieproducer",
      text: "Movie Producer",
      icon: <CameraRollIcon />,
    },

    {
      destination: "adminpages/externaldepartment/managemenusupplier",
      text: "Menu Supplier",
      icon: <FastfoodIcon />,
    },
    {
      destination: "adminpages/externaldepartment/manageadvertiser",
      text: "Advertiser",
      icon: <ContactMailIcon />,
    },
  ];
  return (
    <Box
    // style={{
    //   width: "100%",
    //   height: "100%",
    //   display: "flex",
    //   flexDirection: "column",
    //   justifyContent: "space-between",
    // }}
    >
      <Box style={{}}>
        <List style={{ padding: 0 }}>
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
      </Box>
    </Box>
  );
}

function HRDDrawer() {
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
      destination: "adminpages/humanresourcedepartment/viewemployee",
      text: "View Employee",
      icon: <ListIcon />,
    },
  ];
  return (
    <Box
    // style={{
    //   width: "100%",
    //   height: "100%",
    //   display: "flex",
    //   flexDirection: "column",
    //   justifyContent: "space-between",
    // }}
    >
      <Box style={{}}>
        <List style={{ padding: 0 }}>
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
      </Box>
    </Box>
  );
}

function ManagerDrawer() {
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleOpenSettings() {
    setOpenCollapse(!openCollapse);
  }

  var mainItems = [
    {
      destination: "managerequests",
      text: "Manage Requests",
      icon: <DescriptionIcon />,
    },
  ];

  var subItems = [
    {
      destination: "adminpages/manager/managewarningletter",
      text: "Warning Letters",
      icon: <WarningIcon />,
    },
    {
      destination: "adminpages/manager/managesalaryadjustment",
      text: "Salary Adjustments",
      icon: <AttachMoneyIcon />,
    },
    {
      destination: "adminpages/manager/managefiringrequest",
      text: "Firing Requests",
      icon: <AnnouncementIcon />,
    },
  ];
  return (
    <Box>
      <Box style={{}}>
        <List style={{ padding: 0 }}>
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
      </Box>
    </Box>
  );
}

function ReportDrawer() {
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleOpenSettings() {
    setOpenCollapse(!openCollapse);
  }

  var mainItems = [
    {
      destination: "viewreports",
      text: "View Reports",
      icon: <AssessmentIcon />,
    },
  ];

  var subItems = [
    {
      destination: "adminpages/manager/report/viewequipmentandfacilityreport",
      text: "Equipment & Facility Report",
      icon: <StorageIcon />,
    },
  ];
  return (
    <Box>
      <Box style={{}}>
        <List style={{ padding: 0 }}>
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
      </Box>
    </Box>
  );
}

function AccountingAndFinanceDrawer() {
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleOpenSettings() {
    setOpenCollapse(!openCollapse);
  }

  var mainItems = [
    {
      destination: "viewreports",
      text: "View Reports",
      icon: <AssessmentIcon />,
    },
  ];

  var subItems = [
    {
      destination:
        "adminpages/accountingnfinancedepartment/report/viewpurchasereport",
      text: "Purchase Report",
      icon: <ShoppingCartIcon />,
    },
  ];
  return (
    <Box>
      <Box style={{}}>
        <List style={{ padding: 0 }}>
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
      </Box>
    </Box>
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
  const [auth, setAuth] = React.useState(
    secureLocalStorage.getItem("credentials") as Auth
  );
  const [valid, setValid] = React.useState(false);

  React.useEffect(() => {
    console.log(auth);
    if (auth == null) {
      setAuth(secureLocalStorage.getItem("credentials") as Auth);
    }

    if (auth != null) {
      setValid(true);
    }
  }, [auth]);

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
      <div className={classes.toolbar} style={{ backgroundColor: "#F79A1F" }} />
      <Divider />
      {valid && (
        <List style={{ padding: 0, paddingTop: 10 }}>
          <DashboardItem></DashboardItem>
          {auth.department != "1" && (
            <OperationDrawer auth={auth}></OperationDrawer>
          )}
        </List>
      )}
      {valid && auth.department == "2" && <HRDDrawer></HRDDrawer>}
      {valid && auth.department == "1" && (
        <Box>
          <ManagerDrawer /> <ReportDrawer />
        </Box>
      )}
      {valid && auth.department == "5" && <ExternalDrawer />}
      {valid && auth.department == "3" && <AccountingAndFinanceDrawer />}
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box></Box>
        <Box>
          <SelfServiceDrawer />
        </Box>
      </Box>
    </Drawer>
  );
}
