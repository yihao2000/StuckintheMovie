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
  cancelSelectedFundRequestByAnf,
  confirmReportRepairment,
  confirmSelectedFundRequestByAnf,
  queryAllFundRequest,
  queryEquipmentPurchases,
  queryEquipmentRepairs,
  queryEquipmentReports,
  queryEquipments,
  queryFacilities,
  queryFacilityPurchases,
  queryFacilityRepairs,
  queryFacilityReports,
  rejectReportRepairment,
  reviseSelectedFundRequestByAnf,
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
  Grid,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  RadioGroup,
  FormHelperText,
  FormControl,
  FormLabel,
  Radio,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import { Alert } from "@material-ui/lab";
import { ClipLoader } from "react-spinners";
import { ClickAwayListener } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import InventoryDetailTable from "./inventorydetailtable";
import secureLocalStorage from "react-secure-storage";
import {
  Auth,
  InventoryPurchase,
  InventoryRepair,
} from "../interfaces/interface";
import ReportDetailTable from "./inventoryreportdetailtable";
import RepairDetailTable from "./inventoryrepairdetailtable";
import PurchaseDetailTable from "./inventorypurchasedetailtable";

function createData(
  id: string,
  date: string,
  employeeid: string,
  itemid: string,
  type: string,
  fundrequestid: string,
  quantity: number
): InventoryPurchase {
  return {
    id,
    date,
    employeeid,
    itemid,
    type,
    fundrequestid,
    quantity,
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
  id: keyof InventoryPurchase;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Repair ID",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Repair Date",
  },

  {
    id: "itemid",
    numeric: true,
    disablePadding: false,
    label: "Item ID",
  },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Type",
  },

  {
    id: "quantity",
    numeric: false,
    disablePadding: false,
    label: "Quantity",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof InventoryPurchase
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof InventoryPurchase) =>
    (event: React.MouseEvent<unknown>) => {
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

interface EnhancedTableToolbarProps {}

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

interface Parameter {
  refresh: boolean;
  refreshComponent: Function;
  filter: string;
}

export default function InventoryPurchaseTable(props: Parameter) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof InventoryPurchase>("id");

  const [rows, setRows] = React.useState([]);

  const [action, setAction] = React.useState("");

  const [updating, setUpdating] = React.useState(false);

  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);

  const [selectedPurchase, setselectedPurchase] = React.useState(null);

  const [openDetermine, setOpenDetermine] = React.useState(false);

  const [ableToBeFixed, setAbleToBeFixed] = React.useState("");

  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);

  const handleOpenSuccessMessage = () => {
    setOpenSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
  };

  const handleUpdateReport = async () => {
    if (ableToBeFixed == "yes") {
      confirmReportRepairment(selectedPurchase);
    } else {
      rejectReportRepairment(selectedPurchase);
    }

    setUpdating(true);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);
    setUpdating(false);
    handleOpenSuccessMessage();
    setAbleToBeFixed("");
    setOpenDetailDialog(false);
    setOpenDetermine(false);

    props.refreshComponent();
  };

  const handleAbleToBeFixedChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAbleToBeFixed(event.target.value as string);
  };
  const handleOpenDetermine = () => {
    setOpenDetermine(true);
  };

  const handleCloseDetermine = () => {
    setOpenDetermine(false);
    clearFields();
  };

  const clearFields = () => {
    setAbleToBeFixed("");
  };

  const handleOpenDetailDialog = (row) => {
    setselectedPurchase(row);
    setOpenDetailDialog(true);
  };

  const getColor = (status: string) => {
    if (status === "Pending") {
      return "blue";
    } else if (status == "Reviewed") {
      return "green";
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  React.useEffect(() => {
    var array = [];
    queryEquipmentPurchases().then((e) => {
      e.map((item) => {
        array.push(
          createData(
            item.id,
            item.date,
            item.employeeid,
            item.equipmentid,
            "Equipment",
            item.fundrequestid,
            item.quantity
          )
        );
      });

      queryFacilityPurchases().then((x) => {
        x.map((item) => {
          array.push(
            createData(
              item.id,
              item.date,
              item.employeeid,
              item.facilityid,
              "Equipment",
              item.fundrequestid,
              item.quantity
            )
          );
        });
        array = array.sort((a: InventoryPurchase, b: InventoryPurchase) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        if (props.filter == "Few") {
          array = array.slice(0, 3);
        }
        setRows(array);
      });
    });
  }, [props.refresh]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof InventoryPurchase
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
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
                        <Typography variant="subtitle1">
                          <strong>{row.id}</strong>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">{row.date}</Typography>{" "}
                      </TableCell>

                      <TableCell align="left">{row.itemid}</TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">{row.type}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          style={{ color: getColor(row.status) }}
                          variant="subtitle2"
                        >
                          {row.quantity} Pc(s)
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            handleOpenDetailDialog(row);
                          }}
                        >
                          <ArrowForwardIos fontSize="small"></ArrowForwardIos>
                        </IconButton>
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
            <DialogTitle id="alert-dialog-title">{"Repair Detail"}</DialogTitle>
            <Divider style={{ marginLeft: 15, marginRight: 15 }} />
            <DialogContent>
              <DialogContentText style={{ color: "black" }}>
                <PurchaseDetailTable
                  selectedPurchase={selectedPurchase}
                  setSelectedPurchase={setselectedPurchase}
                />
                <span style={{ color: action == "Confirm" ? "green" : "red" }}>
                  {action}
                </span>{" "}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={updating ? undefined : handleCloseDetailDialog}
                style={{
                  color: "red",
                  cursor: updating ? "not-allowed" : "-moz-grab",
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDetermine}
            onClose={handleCloseDetermine}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle id="alert-dialog-title">
              {"Determine Result"}
            </DialogTitle>
            <Divider style={{ marginLeft: 15, marginRight: 15 }} />
            <DialogContent>
              <Typography variant="subtitle1">
                Is item able to be fixed ?
              </Typography>
              <Box style={{ height: 10 }} />
              <form>
                <FormControl
                  component="fieldset"
                  // error={error}
                >
                  <RadioGroup
                    row
                    aria-label="confirmation"
                    name="confirmation"
                    value={ableToBeFixed}
                    onChange={handleAbleToBeFixedChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={updating ? undefined : handleCloseDetermine}
                style={{
                  color: "red",
                  cursor: updating ? "not-allowed" : "-moz-grab",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateReport}
                style={{
                  color: "green",
                  cursor: updating ? "not-allowed" : "-moz-grab",
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
              Successfully update report!
            </Alert>
          </Snackbar>
        </TableContainer>
      </Paper>
    </div>
  );
}
