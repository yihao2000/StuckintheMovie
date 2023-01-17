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
  queryProducerMovies,
  querySupplierMenus,
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
import { DataManager } from "../manager/DataManager";
import { Menu, Movie, Producer, Supplier } from "../interfaces/interface";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import MenuDetailTable from "./menudetailtable";

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
  id: keyof Menu;
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
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "typeid",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "categoryid",
    numeric: false,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "stock",
    numeric: false,
    disablePadding: false,
    label: "Stock",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Menu
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Menu) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
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
  supplierDetail: Supplier;
}

export default function SupplierMenusTable(props: Parameter) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Menu>("id");

  const [updating, setUpdating] = React.useState(false);

  const [menus, setMenus] = React.useState([]);

  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState(null);

  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);

  const [typeList, setTypeList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);

  const handleOpenDetailDialog = (row) => {
    setSelectedMenu(row);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
  };

  const getType = (id: string) => {
    var name;
    typeList.map((e) => {
      if (e.id == id) {
        name = e.name;
      }
    });

    return name;
  };

  const getCategory = (id: string) => {
    var name;
    categoryList.map((e) => {
      if (e.id == id) {
        name = e.name;
      }
    });

    return name;
  };

  React.useEffect(() => {
    const dataManager = DataManager.getInstance();

    dataManager.getTypeList().then((e) => {
      setTypeList(e);

      dataManager.getCategoryList().then((e) => {
        setCategoryList(e);
      });

      querySupplierMenus(props.supplierDetail.id).then((e) => {
        setMenus(e);
      });
    });
  }, [props.refresh]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Menu
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table
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
            rowCount={menus.length}
          />
          <TableBody>
            {stableSort(menus, getComparator(order, orderBy)).map(
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
                      <Typography variant="subtitle1">{row.name}</Typography>{" "}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2">$ {row.price}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2">
                        {getType(row.typeid)}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="subtitle2">
                        {getCategory(row.categoryid)}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="subtitle2">{row.stock}</Typography>
                    </TableCell>
                    <TableCell align="left">
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
          <DialogTitle id="alert-dialog-title">{"Menu Detail"}</DialogTitle>
          <Divider style={{ marginLeft: 15, marginRight: 15 }} />
          <DialogContent>
            <MenuDetailTable selectedMenu={selectedMenu} />
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
          </DialogActions>
        </Dialog>
      </TableContainer>
    </div>
  );
}
