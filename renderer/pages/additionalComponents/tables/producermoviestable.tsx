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
import { Movie, Producer } from "../interfaces/interface";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import MovieDetailTable from "./moviedetailtable";

function createData(
  id: string,
  producerid: string,
  name: string,
  description: string,
  duration: number,
  genreid: string,
  ageratingid: string,
  startdate: string,
  enddate: string
): Movie {
  return {
    id,
    producerid,
    name,
    description,
    duration,
    genreid,
    ageratingid,
    startdate,
    enddate,
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
  id: keyof Movie;
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
    id: "duration",
    numeric: false,
    disablePadding: false,
    label: "Duration",
  },
  {
    id: "genreid",
    numeric: false,
    disablePadding: false,
    label: "Genre",
  },
  {
    id: "ageratingid",
    numeric: false,
    disablePadding: false,
    label: "Age Rating",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Movie
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Movie) => (event: React.MouseEvent<unknown>) => {
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

interface EnhancedTableToolbarProps {}

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
  producerDetail: Producer;
}

export default function ProducerMoviesTable(props: Parameter) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Movie>("id");

  const [action, setAction] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("");

  const [updating, setUpdating] = React.useState(false);

  const [movies, setMovies] = React.useState([]);

  const [genres, setGenres] = React.useState([]);

  const [ageRatings, setAgeRatings] = React.useState([]);

  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState(false);

  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);

  const [genreList, setGenreList] = React.useState([]);
  const [ageRatingList, setAgeRatingList] = React.useState([]);

  const [selectedMovie, setSelectedMovie] = React.useState(null);

  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
  const handleOpenDetailDialog = (row) => {
    setSelectedMovie(row);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
  };

  const getGenre = (id: string) => {
    var name;
    genreList.map((e) => {
      if (e.id == id) {
        name = e.name;
      }
    });

    return name;
  };

  const getAgeRating = (id: string) => {
    var agerating;
    ageRatingList.map((e) => {
      if (e.id == id) {
        agerating = e.agerating;
      }
    });

    return agerating;
  };

  // const confirmAction = async () => {
  //   if (action === "Confirm") {
  //     confirmSelectedFundRequestByAnf(selectedId);
  //   } else if (action == "Cancel") {
  //     cancelSelectedFundRequestByAnf(selectedId);
  //   } else if (action == "Revise") {
  //     reviseSelectedFundRequestByAnf(selectedId);
  //   }

  //   setUpdating(true);
  //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  //   await delay(2000);
  //   setUpdating(false);
  //   setOpenSuccessMessage(true);
  //   setOpenConfirmationDialog(false);
  //   setAction("");
  //   setSelectedId("");
  // };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
    setSelectedId("");
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
    const dataManager = DataManager.getInstance();

    dataManager.getGenreList().then((e) => {
      setGenreList(e);

      dataManager.getAgeRatingList().then((e) => {
        setAgeRatingList(e);

        queryProducerMovies(props.producerDetail.id).then((e) => {
          setMovies(e);
        });
      });
    });
  }, [props.refresh]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Movie
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
            rowCount={movies.length}
          />
          <TableBody>
            {stableSort(movies, getComparator(order, orderBy)).map(
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
                      <Typography variant="subtitle2">
                        {row.duration + " Minutes"}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2">
                        {getGenre(row.genreid)}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="subtitle2">
                        {getAgeRating(row.ageratingid)}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box>
                        <IconButton
                          onClick={() => {
                            handleOpenDetailDialog(row);
                          }}
                        >
                          <ArrowForwardIos fontSize="small"></ArrowForwardIos>
                        </IconButton>
                      </Box>
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
            {"Advertiser Detail"}
          </DialogTitle>
          <Divider style={{ marginLeft: 15, marginRight: 15 }} />
          <DialogContent>
            <MovieDetailTable selectedMovie={selectedMovie} />
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
      </TableContainer>
    </div>
  );
}
