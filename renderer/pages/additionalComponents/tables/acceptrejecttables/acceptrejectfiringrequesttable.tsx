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
  acceptSelectedFiringRequest,
  acceptSelectedSalaryAdjustment,
  acceptSelectedWarningLetter,
  cancelSelectedFundRequestByAnf,
  confirmSelectedFundRequestByAnf,
  queryAllFundRequest,
  queryEmployeeSalary,
  queryEmployeeWarningLetterAmount,
  queryEquipments,
  queryFacilities,
  querySpecificEmployee,
  rejectSelectedFiringRequest,
  rejectSelectedSalaryAdjustment,
  rejectSelectedWarningLetter,
  reviseSelectedFundRequestByAnf,
} from "../../../database/query";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
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
import InventoryDetailTable from "../inventorydetailtable";
import { Interface } from "readline";
import {
  FiringRequest,
  SalaryAdjustmentRequest,
  WarningLetter,
} from "../../interfaces/interface";
import DetailTable from "../employeedetailtable";

interface Data {
  id: string;
  requestdate: string;
  status: string;
  employeeid: string;
  employeename: string;
  employeedepartment: string;
  employeedivision: string;
}

function createData(
  id: string,
  requestdate: string,
  status: string,
  employeeid: string,
  employeename: string,
  employeedepartment: string,
  employeedivision: string
): Data {
  return {
    id,
    requestdate,
    status,
    employeeid,
    employeename,
    employeedepartment,
    employeedivision,
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
    label: "Firing ID",
  },
  {
    id: "requestdate",
    numeric: false,
    disablePadding: false,
    label: "Request Date",
  },
  {
    id: "employeeid",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "employeename",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "employeedepartment",
    numeric: true,
    disablePadding: false,
    label: "Department",
  },
  {
    id: "employeedivision",
    numeric: true,
    disablePadding: false,
    label: "Division",
  },
  {
    id: "status",
    numeric: true,
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
  data: FiringRequest[];
  filter: string;
}

export default function AcceptRejectFiringRequestTable(props: Props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("id");

  const [rows, setRows] = React.useState([]);

  const [action, setAction] = React.useState("");

  const [updating, setUpdating] = React.useState(false);

  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [selectedFiringRequest, setSelectedFiringRequest] =
    React.useState(null);
  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);

  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);

  const handleOpenSuccessMessage = () => {
    setOpenSuccessMessage(true);
  };
  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
  };
  const handleOpenDetailDialog = (row, action) => {
    if (action == "Accepted") {
      setAction("Accepted");
    } else if (action == "Rejected") {
      setAction("Rejected");
    }
    setSelectedFiringRequest(row);
    querySpecificEmployee(row.employeeid).then((e) => {
      setSelectedEmployee(e);
    });
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedEmployee(null);
    setSelectedFiringRequest(null);
  };

  const handleCloseActionConfirmation = () => {
    setSelectedEmployee(null);
    setOpenDetailDialog(false);
  };

  const handleOpenActionConfirmation = async () => {
    if (action == "Accepted") {
      acceptSelectedFiringRequest(selectedFiringRequest);
    } else if (action == "Rejected") {
      rejectSelectedFiringRequest(selectedFiringRequest);
    }
    setUpdating(true);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);
    props.refreshComponent();
    setOpenDetailDialog(false);
    setUpdating(false);
    setOpenSuccessMessage(true);
  };

  const getColor = (status: string) => {
    if (status == "Accepted") {
      return "green";
    } else if (status == "Revised") {
      return "orange";
    } else {
      return "red";
    }
  };

  React.useEffect(() => {
    console.log(props.data);
    var array = [];
    if (props.filter == "All") {
      props.data.map((e) => {
        array.push(
          createData(
            e.id,
            e.requestdate,
            e.status,
            e.employeeid,
            e.employeename,
            e.employeedepartment,
            e.employeedivision
          )
        );
      });
    } else if (props.filter == "Pending") {
      array = props.data.filter((event) => {
        return event.status == "Pending";
      });
    } else if (props.filter == "Accepted") {
      array = props.data.filter((event) => {
        return event.status == "Accepted";
      });
    } else if (props.filter == "Rejected") {
      array = props.data.filter((event) => {
        return event.status == "Rejected";
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
                          {row.requestdate}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.employeeid}
                        </Typography>{" "}
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.employeename}
                        </Typography>{" "}
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.employeedepartment}
                        </Typography>{" "}
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.employeedivision}
                        </Typography>{" "}
                      </TableCell>

                      <TableCell align="left">
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: getColor(row.status),
                          }}
                        >
                          {row.status}
                        </Typography>{" "}
                      </TableCell>

                      {row.status == "Pending" && (
                        <TableCell align="left">
                          <IconButton
                            style={{ padding: 5 }}
                            onClick={() => {
                              handleOpenDetailDialog(row, "Rejected");
                            }}
                          >
                            <ClearIcon
                              style={{ color: "red" }}
                              fontSize="medium"
                            ></ClearIcon>
                          </IconButton>
                          <IconButton
                            style={{ padding: 5 }}
                            onClick={() => {
                              handleOpenDetailDialog(row, "Accepted");
                            }}
                          >
                            <CheckIcon
                              fontSize="medium"
                              style={{ color: "green" }}
                            ></CheckIcon>
                          </IconButton>
                        </TableCell>
                      )}
                      {row.status != "Pending" && <TableCell />}
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
            <DialogTitle id="alert-dialog-title" disableTypography>
              <Typography variant="h5">
                <strong>Employee Detail</strong>
                <Divider
                  style={{
                    marginTop: 10,
                  }}
                />
              </Typography>
            </DialogTitle>

            <DialogContent>
              <Box
                style={{ width: "100%" }}
                display="flex"
                justifyContent="center"
              >
                <Box style={{ width: "100%" }}>
                  <DetailTable
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                  />
                </Box>
              </Box>
              <Box style={{ height: 20 }}></Box>
              <Box>
                <Typography variant="subtitle2" style={{ color: "grey" }}>
                  Warning: This employee will be firing request status will be{" "}
                  <span style={{ color: getColor(action) }}>{action}</span> !
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions style={{ paddingTop: 0 }}>
              <Button
                onClick={updating ? undefined : handleCloseActionConfirmation}
                style={{
                  cursor: updating ? "not-allowed" : "-moz-grab",
                  color: "#EB4F47",
                }}
              >
                Cancel
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
              Successfully Update Firing Request Status!
            </Alert>
          </Snackbar>
        </TableContainer>
      </Paper>
    </div>
  );
}
