import React from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";

import {
  acceptSelectedSalaryAdjustment,
  adjustEmployeeSalary,
  queryEmployeeSalary,
  rejectSelectedSalaryAdjustment,
  updateAdjustmentRequestAdjustedStatus,
} from "../../database/query";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import { Alert } from "@material-ui/lab";
import { ClipLoader } from "react-spinners";
import { ClickAwayListener } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import { Interface } from "readline";
import {
  SalaryAdjustmentRequest,
  WarningLetter,
} from "../../additionalComponents/interfaces/interface";
import SalaryAdjustmentRequestDetailTable from "./salaryadjustmentrequestdetailtable";

interface Data {
  id: string;
  employeeid: string;
  requestdate: string;
  requesterid: string;
  salaryadjustment: number;
  status: string;
  salary: number;
  employeename: string;
  adjusted: string;
}

function createData(
  id: string,
  employeeid: string,
  requestdate: string,
  requesterid: string,
  salaryadjustment: number,
  status: string,
  salary: number,
  employeename: string,
  adjusted: string
): Data {
  return {
    id,
    employeeid,
    requestdate,
    requesterid,
    salaryadjustment,
    status,
    salary,
    employeename,
    adjusted,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Adjustment ID",
  },
  {
    id: "employeeid",
    numeric: false,
    disablePadding: false,
    label: "Employee ID",
  },
  {
    id: "requestdate",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "requesterid",
    numeric: false,
    disablePadding: false,
    label: "Requester ID",
  },
  {
    id: "salary",
    numeric: true,
    disablePadding: false,
    label: "Current Salary",
  },
  {
    id: "salaryadjustment",
    numeric: true,
    disablePadding: false,
    label: "Adjustment",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead style={{ boxShadow: "none" }}>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
      boxShadow: "none",
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

interface Props {
  refreshComponent: Function;
  data: SalaryAdjustmentRequest[];
  filter: string;
}

export default function SalaryAdjustmentRequestTable(props: Props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("id");

  const [rows, setRows] = React.useState([]);

  const [updating, setUpdating] = React.useState(false);

  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);

  const [selectedSalaryAdjustment, setSelectedSalaryAdjustment] =
    React.useState(null);

  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);

  const handleOpenSuccessMessage = () => {
    setOpenSuccessMessage(true);
  };
  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
  };
  const handleOpenDetailDialog = (row) => {
    setSelectedSalaryAdjustment(row);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const getEmployeeSalary = () => {
    queryEmployeeSalary(selectedSalaryAdjustment.employeeid).then((e) => {
      return e[0].salary;
    });
  };

  const handleCloseActionConfirmation = () => {
    setSelectedSalaryAdjustment(null);
    setOpenDetailDialog(false);
  };

  const handleOpenActionConfirmation = async () => {
    setUpdating(true);

    adjustEmployeeSalary(
      selectedSalaryAdjustment.employeeid,
      selectedSalaryAdjustment.salaryadjustment
    );

    updateAdjustmentRequestAdjustedStatus(selectedSalaryAdjustment.id);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);
    props.refreshComponent();
    setOpenDetailDialog(false);
    setUpdating(false);
    setOpenSuccessMessage(true);
  };

  const getColor = (status: string) => {
    if (status == "true") {
      return "green";
    } else if (status == "false") {
      return "blue";
    }
  };

  React.useEffect(() => {
    var array = [];

    props.data.map((e) => {
      array.push(
        createData(
          e.id,
          e.employeeid,
          e.requestdate,
          e.requesterid,
          e.salaryadjustment,
          e.status,
          e.salary,
          e.employeename,
          e.adjusted
        )
      );
    });

    array = props.data.filter((event) => {
      return event.status == "Accepted";
    });

    if (props.filter == "Pending") {
      array = props.data.filter((event) => {
        return event.adjusted == "false" && event.status == "Accepted";
      });
    } else if (props.filter == "Adjusted") {
      array = props.data.filter((event) => {
        return event.adjusted == "true" && event.status == "Accepted";
      });
    }

    setRows(array);
  }, [props.data]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Box style={{ height: "40px" }}></Box>
        <TableContainer>
          <Table
            style={{ boxShadow: "none" }}
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
            size="medium"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map(
                (row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell
                        padding="checkbox"
                        style={{ height: "80px" }}
                      ></TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Typography variant="subtitle2">
                          <strong>{row.id}</strong>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.employeeid}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.requestdate}
                        </Typography>{" "}
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.requesterid}
                        </Typography>{" "}
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          $ {" " + row.salary}
                        </Typography>{" "}
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          $ {" " + row.salaryadjustment}
                        </Typography>{" "}
                      </TableCell>

                      <TableCell align="left">
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: getColor(row.adjusted),
                          }}
                        >
                          {row.adjusted == "false" ? "Pending" : "Adjusted"}
                        </Typography>{" "}
                      </TableCell>

                      <TableCell align="left">
                        {row.adjusted == "false" && (
                          <IconButton
                            style={{ padding: 5 }}
                            onClick={() => {
                              handleOpenDetailDialog(row);
                            }}
                          >
                            <ArrowForwardIosIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>

          <Dialog
            open={openDetailDialog}
            onClose={handleCloseDetailDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle id="alert-dialog-title">
              {"Salary Adjusment Request Detail"}
            </DialogTitle>
            <Divider style={{ marginLeft: 15, marginRight: 15 }} />
            <DialogContent style={{ paddingBottom: 0 }}>
              <SalaryAdjustmentRequestDetailTable
                selectedSalaryAdjustmentRequest={selectedSalaryAdjustment}
              />
            </DialogContent>
            <DialogActions style={{ paddingTop: 0 }}>
              <Button
                onClick={updating ? undefined : handleCloseActionConfirmation}
                style={{
                  cursor: updating ? "not-allowed" : "-moz-grab",
                  color: "#EB4F47",
                }}
              >
                Close
              </Button>
              <Button
                onClick={updating ? undefined : handleOpenActionConfirmation}
                style={{
                  cursor: updating ? "not-allowed" : "-moz-grab",
                  color: "green",
                }}
              >
                {updating ? (
                  <ClipLoader
                    loading={updating}
                    size={20}
                    color="ffffff"
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={openSuccessMessage}
            autoHideDuration={4000}
            onClose={handleCloseSuccessMessage}
          >
            <Alert onClose={handleCloseSuccessMessage} severity="success">
              Successfully Adjust Selected Employee Salary!
            </Alert>
          </Snackbar>
        </TableContainer>
      </Paper>
    </div>
  );
}
