import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import ClipLoader from "react-spinners/ClipLoader";
import {
  getNotificationCounter,
  insertFiringRequest,
  insertWarningLetter,
  queryDepartments,
  queryDivisions,
  queryEmployees,
  queryEmployeeWarningLetterAmount,
  querySpecificEmployee,
} from "../../database/query";
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  lighten,
  Select,
  Snackbar,
  Switch,
  TableFooter,
  TablePagination,
  TableSortLabel,
  TextareaAutosize,
  TextField,
  Toolbar,
  Tooltip,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ControlledButton } from "../buttons/controlledbutton";
import Loadingbutton from "../buttons/loadingbutton";

interface Data {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  division: string;
  salary: number;
}

function createData(
  id: string,
  name: string,
  email: string,
  phone: string,
  department: string,
  division: string,
  salary: number
): Data {
  return { id, name, email, phone, department, division, salary };
}

const employeeData = queryEmployees();
const departmentData = queryDepartments();
const divisionData = queryDivisions();

const divisionList = [];
const departmentList = [];
const employeeList = [];

const loadDepartmentData = async (setDepartmentLoaded: any) => {
  const pushData = await departmentData.then((data) => {
    data.map((e) => {
      departmentList.push(e);
    });
    setDepartmentLoaded(true);
  });

  departmentData.then((data) => {
    data.map((e) => {
      departmentList.push(e);
    });
    setDepartmentLoaded(true);
  });
};

const loadDivisionData = async (setDivisionLoaded: any) => {
  const pushData = await divisionData.then((data) => {
    data.map((e) => {
      divisionList.push(e);
    });
    setDivisionLoaded(true);
  });
};

function getDivisionName(division: string) {
  var name = "None";
  divisionList.filter((e) => {
    if (e.id === division) {
      console.log(e.name);
      name = e.name;
    }
  });
  return name;
}

function getDepartmentName(department: string) {
  var name = "None";

  departmentList.find((e) => {
    if (e.id == department) {
      name = e.name;
    }
  });

  return name;
}

const loadEmployeeData = async (setEmployeeLoaded: any) => {
  const pushData = await employeeData.then((data) => {
    data.map((e) => {
      employeeList.push(
        createData(
          e.id,
          e.name,
          e.email,
          e.phone,
          getDepartmentName(e.department),
          getDivisionName(e.division),
          10
        )
      );
      rows.push(
        createData(
          e.id,
          e.name,
          e.email,
          e.phone,
          getDepartmentName(e.department),
          getDivisionName(e.division),
          10
        )
      );
    });
    setEmployeeLoaded(true);

    console.log(rows);
  });
};

const rows = [];

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
    label: "Employee ID",
  },
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  { id: "phone", numeric: false, disablePadding: false, label: "Phone" },
  {
    id: "department",
    numeric: false,
    disablePadding: false,
    label: "Department",
  },
  { id: "division", numeric: false, disablePadding: false, label: "Division" },
  { id: "salary", numeric: true, disablePadding: false, label: "Salary" },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"right"}
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
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Employees
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
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

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("id");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [employeeLoaded, setEmployeeLoaded] = React.useState(false);
  const [departmentLoaded, setDepartmentLoaded] = React.useState(false);
  const [divisionLoaded, setDivisionLoaded] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
  const [openWarningLetterDialog, setOpenWarningLetterDialog] =
    React.useState(false);

  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [selectedReason, setSelectedReason] = React.useState("");
  const [warningLetterTotal, setWarningLetterTotal] = React.useState(0);

  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);

  React.useEffect(() => {
    if (rows.length != 0) {
      console.log("Ke length != 0");
      setDepartmentLoaded(true);
      setEmployeeLoaded(true);
      setDivisionLoaded(true);
    } else {
      console.log("Ke else");
      loadDepartmentData(setDepartmentLoaded).then(() => {
        loadDivisionData(setDivisionLoaded).then(() => {
          loadEmployeeData(setEmployeeLoaded);
        });
      });
    }
  }, []);

  const handleCloseWarningLetterDialog = () => {
    setSelectedReason("");
    setOpenWarningLetterDialog(false);
  };
  const handleOpenDetailDialog = (passedEmployee) => {
    getNotificationCounter(passedEmployee.id);
    const employee = querySpecificEmployee(passedEmployee.id);
    employee.then((e) => {
      setSelectedEmployee(e[0]);
      countWarningLetterTotal(passedEmployee.id);
    });
    setOpenDetailDialog(true);
  };

  const countWarningLetterTotal = (id) => {
    console.log(id);
    const result = queryEmployeeWarningLetterAmount(id);

    result.then((e) => {
      setWarningLetterTotal(e);

      if (e > 3) {
        insertFiringRequest(id);
      }
    });
  };

  const handleOpenSuccessMessage = () => {
    setOpenSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
  };

  const handleSelectedReason = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setSelectedReason(event.target.value as string);
  };
  const handleOpenWarningLetterDialog = () => {
    if (selectedEmployee) {
      countWarningLetterTotal(selectedEmployee.id);
    }
    // const employee = querySpecificEmployee(selectedEmployee.id);
    // employee.then((e) => {
    //   setSelectedEmployee(e[0]);

    // });
    setOpenWarningLetterDialog(true);
  };

  const handleWarningLetterSubmission = () => {
    setLoading(true);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    insertWarningLetter(selectedEmployee.id, selectedReason).then(async () => {
      await delay(2000);
      countWarningLetterTotal(selectedEmployee.id);
      handleOpenSuccessMessage();
      handleCloseWarningLetterDialog();
      setLoading(false);
    });
  };
  const handleCloseDetailDialog = () => {
    setWarningLetterTotal(0);
    setOpenDetailDialog(false);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {employeeLoaded &&
                divisionLoaded &&
                departmentLoaded &&
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id as string);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(event) =>
                              handleClick(event, row.id as string)
                            }
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">{row.phone}</TableCell>
                        <TableCell align="right">{row.department}</TableCell>
                        <TableCell align="right">{row.division}</TableCell>
                        <TableCell align="right">{row.salary}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#38b4fc",
                            }}
                            size="small"
                            onClick={() => {
                              handleOpenDetailDialog(row);
                            }}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {selectedEmployee && (
                <Dialog
                  fullWidth
                  open={openDetailDialog}
                  onClose={handleCloseDetailDialog}
                  maxWidth="sm"
                  BackdropProps={{
                    timeout: 500,
                  }}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  closeAfterTransition
                >
                  <DialogTitle id="alert-dialog-title" disableTypography>
                    <Typography variant="h5">
                      <strong>Employee Detail</strong>
                    </Typography>
                  </DialogTitle>

                  <DialogContent>
                    <Typography variant="h6">Employee Name</Typography>
                    <Button onClick={handleOpenWarningLetterDialog}>
                      Issue Warning Letter
                    </Button>
                  </DialogContent>
                </Dialog>
              )}

              {openWarningLetterDialog && (
                <Dialog
                  fullWidth
                  open={openWarningLetterDialog}
                  onClose={handleCloseWarningLetterDialog}
                  maxWidth="sm"
                  BackdropProps={{
                    timeout: 500,
                  }}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  closeAfterTransition
                >
                  <DialogTitle id="alert-dialog-title" disableTypography>
                    <Typography variant="h5">
                      <strong>Warning Letter Issuance</strong>
                    </Typography>
                  </DialogTitle>

                  <DialogContent>
                    <Typography variant="h6" style={{}}>
                      Issuance Reason:
                    </Typography>
                    <FormControl
                      variant="filled"
                      style={{
                        minWidth: 500,
                      }}
                    >
                      <InputLabel htmlFor="filled-age-native-simple">
                        Reason
                      </InputLabel>
                      <Select
                        native
                        value={selectedReason}
                        onChange={handleSelectedReason}
                        inputProps={{
                          name: "age",
                          id: "filled-age-native-simple",
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value={"Reason 1"}>Reason 1</option>
                        <option value={"Reason 2"}>Reason 2</option>
                        <option value={"Reason 3"}>Reason 3</option>
                        <option value={"Reason 4"}>Reason 4</option>
                        <option value={"Reason 5"}>Reason 5</option>
                        <option value={"Reason 6"}>Reason 6</option>
                      </Select>
                    </FormControl>

                    <Typography
                      variant="subtitle1"
                      style={{
                        color: "red",
                      }}
                    >
                      <strong>
                        You are about to issue Warning Letter to selected
                        employee !
                      </strong>
                    </Typography>

                    <Typography variant="subtitle1">
                      This employee currently has{" "}
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {warningLetterTotal}
                      </span>{" "}
                      Warning Letters
                    </Typography>
                    <Grid container>
                      <Grid item xs={2}>
                        {" "}
                        <Button
                          onClick={handleCloseWarningLetterDialog}
                          style={{ backgroundColor: "red" }}
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          onClick={
                            loading ? undefined : handleWarningLetterSubmission
                          }
                          style={{
                            backgroundColor: "#38b4fc",
                            cursor: loading ? "not-allowed" : "default",
                          }}
                        >
                          {loading ? (
                            <ClipLoader
                              loading={loading}
                              size={20}
                              color="ffffff"
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>
              )}
              <Snackbar
                open={openSuccessMessage}
                autoHideDuration={6000}
                onClose={handleCloseSuccessMessage}
              >
                <Alert onClose={handleCloseSuccessMessage} severity="success">
                  Successfully issue Warning Letter!
                </Alert>
              </Snackbar>
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
