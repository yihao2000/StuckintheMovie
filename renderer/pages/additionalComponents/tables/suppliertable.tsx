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
  queryMembers,
  queryProducers,
  querySuppliers,
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
  Tab,
  Tabs,
  withStyles,
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
import { Member, Producer, Supplier } from "../interfaces/interface";
import MemberDetailTable from "./memberdetailtable";
import ProducerDetailTable from "./producerdetailtable";
import { ProducerMovieTab } from "../tabpage/producermovietab";
import SupplierDetailTable from "./supplierdetailtable";
import { SupplierMenuTab } from "../tabpage/suppliermenutab";
import {
  seedMenuCategories,
  seedMenuTypes,
  seedMovieGenres,
} from "../../seeder/seeder";

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
  refresh: boolean;

  supplierDetail: Supplier;
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
          <AntTab label="Information" />
          <AntTab label="Menus" />
        </AntTabs>

        {value == 0 && (
          <SupplierDetailTable selectedSupplier={props.supplierDetail} />
        )}

        {value == 1 && (
          <SupplierMenuTab selectedSupplier={props.supplierDetail} />
        )}

        {/* {value == 2 && (

        )}

        {value == 3 && (
    
        )} */}
      </div>
    </div>
  );
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
  id: keyof Producer;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Phone",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Supplier
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Supplier) => (event: React.MouseEvent<unknown>) => {
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
  refreshComponent: Function;
  refresh: boolean;
}

export default function SupplierTable(props: Parameter) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Supplier>("id");

  const [action, setAction] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("");

  const [updating, setUpdating] = React.useState(false);

  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);

  const [selectedSuppliers, setSelectedSuppliers] = React.useState(null);
  const [suppliers, setSuppliers] = React.useState([]);

  React.useEffect(() => {
    querySuppliers().then((e) => {
      setSuppliers(e);
    });
  }, [props.refresh]);

  const handleOpenDetailDialog = (row) => {
    setSelectedSuppliers(row);
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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Supplier
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
              rowCount={suppliers.length}
            />
            <TableBody>
              {stableSort(suppliers, getComparator(order, orderBy)).map(
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
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>{row.description}</Typography>
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">{row.phone}</Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2">{row.phone}</Typography>
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
            maxWidth="md"
          >
            <DialogTitle id="alert-dialog-title">
              {"Producer Detail"}
            </DialogTitle>
            <Divider style={{ marginLeft: 15, marginRight: 15 }} />
            <DialogContent>
              <CustomizedTabs
                supplierDetail={selectedSuppliers}
                refresh={props.refresh}
                refreshComponent={props.refreshComponent}
              />
              <DialogContentText style={{ color: "black" }}>
                <span style={{ color: action == "Confirm" ? "green" : "red" }}>
                  {action}
                </span>{" "}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDetailDialog}
                style={{
                  color: "red",
                  cursor: updating ? "not-allowed" : "-moz-grab",
                }}
              >
                Close
              </Button>
              {/* <Button
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
