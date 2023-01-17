import React from "react";
import Head from "next/head";
import {
  Theme,
  makeStyles,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "next/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import { SideDrawer } from "../../additionalComponents/drawer/sidedrawer";
import PrimarySearchAppBar from "../../additionalComponents/appbar/customappbar";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Box } from "@material-ui/core";

import { ClipLoader } from "react-spinners";
import { Alert, TabPanel } from "@material-ui/lab";
import FundRequestTable from "../../additionalComponents/tables/fundrequeststable";
import Tooltip from "@material-ui/core/Tooltip";
import InventoryTable from "../../additionalComponents/tables/inventorytable";
import {
  queryAllSalaryAdjustmentRequests,
  querySpecificEmployee,
  queryWarningLetters,
} from "../../database/query";
import AcceptRejectTable from "../../additionalComponents/tables/acceptrejecttables/acceptrejectwarninglettertable";
import { Interface } from "readline";
import {
  Employee,
  FundRequest,
  SalaryAdjustmentRequest,
  WarningLetter,
} from "../../additionalComponents/interfaces/interface";
import AcceptRejectWarningLetterTable from "../../additionalComponents/tables/acceptrejecttables/acceptrejectwarninglettertable";
import AcceptRejectSalaryAdjustmentTable from "../../additionalComponents/tables/acceptrejecttables/acceptrejectsalaryadjustmenttable";

const drawerWidth = 260;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      paddingTop: theme.spacing(4),
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: "#181c20",
      paddingLeft: 20,
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

    createButton: {
      backgroundColor: "#EB4F47",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      width: `calc(100% - 260px)`,
      height: "100vh",
      backgroundColor: "#FFFFFF",
      padding: theme.spacing(3),
    },
    tabs: {
      "& .MuiTab-root.Mui-selected": {
        color: "#F79A1F",
      },
      "&.Mui-disabled": {
        width: 0,
      },
    },

    tab: {
      width: "50px",
    },
  })
);

const AntTabs = withStyles({
  indicator: {
    backgroundColor: "#F79A1F",
  },
})(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      minWidth: 72,

      marginRight: theme.spacing(4),

      "&:hover": {
        color: "#F79A1F",
        opacity: 1,
      },
      "&$selected": {
        color: "#F79A1F",
      },
      "&:focus": {
        color: "#F79A1F",
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "50%",
      backgroundColor: "#635ee7",
    },
  },
})((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

interface StyledTabProps {
  label: string;
}

interface Data {
  refreshComponent: Function;
  data: SalaryAdjustmentRequest[];
}
export function CustomizedTabs(props: Data) {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 1,
    },
    padding: {
      padding: theme.spacing(3),
    },
    demo1: {
      backgroundColor: "transparent",
    },
    demo2: {
      backgroundColor: "#2e1534",
    },
  }));

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="All" />
          <AntTab label="Pending" />
          <AntTab label="Accepted" />
          <AntTab label="Rejected" />
        </AntTabs>

        {value == 0 && (
          <AcceptRejectSalaryAdjustmentTable
            filter="All"
            data={props.data}
            refreshComponent={props.refreshComponent}
          />
        )}

        {value == 1 && (
          <AcceptRejectSalaryAdjustmentTable
            filter="Pending"
            data={props.data}
            refreshComponent={props.refreshComponent}
          />
        )}

        {value == 2 && (
          <AcceptRejectSalaryAdjustmentTable
            filter="Accepted"
            data={props.data}
            refreshComponent={props.refreshComponent}
          />
        )}

        {value == 3 && (
          <AcceptRejectSalaryAdjustmentTable
            filter="Rejected"
            data={props.data}
            refreshComponent={props.refreshComponent}
          />
        )}
      </div>
    </div>
  );
}

function Inventory() {
  const [refresh, setRefresh] = React.useState(false);

  const [salaryAdjustmentRequests, setSalaryAdjustmentRequests] =
    React.useState([]);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  React.useEffect(() => {
    queryAllSalaryAdjustmentRequests().then((data) => {
      data.map((e) => {
        querySpecificEmployee(e.employeeid).then((x) => {
          e.salary = x.salary;
          e.employeename = x.name;

          setSalaryAdjustmentRequests(data);
        });
      });
    });
  }, [refresh]);

  const classes = useStyles({});

  return (
    <React.Fragment>
      <Head>
        <title>Manage Salary Adjustment</title>
      </Head>
      <div className={classes.root}>
        <CssBaseline />
        <PrimarySearchAppBar />
        <SideDrawer />
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Typography
            variant="h4"
            style={{ fontWeight: "bold", marginLeft: "20" }}
          >
            Manage Salary Adjustment
          </Typography>
          <Box height={20}></Box>
          <CustomizedTabs
            refreshComponent={refreshComponent}
            data={salaryAdjustmentRequests}
          />
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Inventory);
