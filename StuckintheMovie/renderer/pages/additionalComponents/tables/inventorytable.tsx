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
  confirmSelectedFundRequestByAnf,
  queryAllFundRequest,
  queryEquipments,
  queryFacilities,
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

interface Data {
  inventoryid: string;
  inventoryname: string;
  inventorytype: string;
  inventorydescription: string;
  inventorydamagestatus: string;
  inventoryprice: number;
  inventoryavailabilitystatus: string;
}

function createData(
  inventoryid: string,
  inventoryname: string,
  inventorytype: string,
  inventorydescription: string,
  inventorydamagestatus: string,
  inventoryprice: number,
  inventoryavailabilitystatus: string
): Data {
  return {
    inventoryid,
    inventoryname,
    inventorytype,
    inventorydescription,
    inventorydamagestatus,
    inventoryprice,
    inventoryavailabilitystatus,
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
    id: "inventoryid",
    numeric: false,
    disablePadding: true,
    label: "Facility(s)",
  },
  {
    id: "inventoryname",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "inventorytype",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },

  {
    id: "inventorydescription",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "inventoryprice",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "inventorydamagestatus",
    numeric: false,
    disablePadding: false,
    label: "Damage",
  },
  {
    id: "inventoryavailabilitystatus",
    numeric: false,
    disablePadding: false,
    label: "Availability",
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

interface IIventoryTable {
  filter: string;
  successMessage: boolean;
}

export default function InventoryTable(props: IIventoryTable) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("inventoryid");

  const [inventoryData, setInventoryData] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const [action, setAction] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("");

  const [updating, setUpdating] = React.useState(false);

  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);

  const [selectedInventory, setSelectedInventory] = React.useState(null);

  const handleOpenDetailDialog = (row) => {
    setSelectedInventory(row);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const getColor = (status: string) => {
    if (status == "Pending" || status == "Waiting for manager") {
      return "blue";
    } else if (status == "Accepted") {
      return "green";
    } else if (status == "Revised") {
      return "orange";
    } else {
      return "red";
    }
  };

  React.useEffect(() => {
    var array = [];

    if (props.filter == "All") {
      queryEquipments().then((equipments) => {
        array = equipments;
        array.map((e) => {
          e.type = "Equipment";
        });
        queryFacilities().then((facilities) => {
          facilities.map((e) => {
            e.type = "Facility";
          });
          array = array.concat(facilities);
          console.log(array);
          setInventoryData(array);
        });
      });
    } else if (props.filter == "Equipments") {
    }
  }, [props.successMessage]);

  React.useEffect(() => {
    var array = [];
    inventoryData.map((item) => {
      array.push(
        createData(
          item.id,
          item.name,
          item.type,
          item.description,
          item.damagestatus,
          item.price,
          item.availabilitystatus
        )
      );
    });
    setRows(array);
  }, [inventoryData]);

  //   React.useEffect(() => {
  //     var array = [];
  //     fundData.map((e) => {
  //       var status;
  //       if (e.anfstatus == "Declined" || e.managerstatus == "Declined") {
  //         status = "Rejected";
  //       } else if (e.anfstatus == "Revised" || e.managerstatus == "Revised") {
  //         status = "Revised";
  //       } else if (e.anfstatus == "Pending") {
  //         status = "Pending";
  //       } else if (e.managerstatus == "Pending") {
  //         status = "Waiting for manager";
  //       } else if (e.anfstatus == "Accepted" && e.managerstatus == "Accepted") {
  //         status = "Accepted";
  //       }
  //       console.log(status);
  //       array.push(
  //         createData(
  //           e.id,
  //           e.requesterid,
  //           e.date,
  //           e.amount,
  //           e.reason,
  //           e.anfstatus,
  //           e.managerstatus,
  //           status
  //         )
  //       );
  //     });
  //     setRows(array);
  //   }, [fundData]);

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
        {/* <Toolbar>
          <Box style={{ height: "80px", paddingLeft: "checkbox" }}></Box>
          <Typography style={{ padding: "0px" }}>Inventories</Typography>
        </Toolbar> */}
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
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.inventoryid}
                    >
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
                        <Grid container direction="column">
                          <Grid item>
                            <Typography variant="subtitle1">
                              <strong>{row.requesterid}</strong>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="subtitle2"
                              style={{ color: "gray" }}
                            >
                              {row.inventoryid}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>{row.inventoryname}</Typography>{" "}
                      </TableCell>
                      <TableCell align="left">{row.inventorytype}</TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.inventorydescription}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: getColor(row.requeststatus),
                          }}
                        >
                          {row.inventoryprice}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.inventorydamagestatus}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {row.inventoryavailabilitystatus}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <ArrowForwardIos
                            fontSize="small"
                            onClick={() => {
                              handleOpenDetailDialog(row);
                            }}
                          ></ArrowForwardIos>
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
            <DialogTitle id="alert-dialog-title">
              {"Inventory Detail"}
            </DialogTitle>
            <Divider style={{ marginLeft: 15, marginRight: 15 }} />
            <DialogContent>
              <DialogContentText style={{ color: "black" }}>
                <InventoryDetailTable
                  selectedInventory={selectedInventory}
                  setSelectedInventory={setSelectedInventory}
                />
                <span style={{ color: action == "Confirm" ? "green" : "red" }}>
                  {action}
                </span>{" "}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {/* <Button
                onClick={updating ? undefined : handleCloseConfirmationDialog}
                color="primary"
                style={{
                  cursor: updating ? "not-allowed" : "-moz-grab",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={updating ? undefined : confirmAction}
                color="primary"
                style={{
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
              </Button> */}
            </DialogActions>
          </Dialog>
          {/* <Snackbar
            open={openSuccessMessage}
            autoHideDuration={4000}
            onClose={handleCloseSuccessMessage}
          >
            <Alert onClose={handleCloseSuccessMessage} severity="success">
              Successfully issue Warning Letter!
            </Alert>
          </Snackbar> */}
        </TableContainer>
      </Paper>
    </div>
  );
}
