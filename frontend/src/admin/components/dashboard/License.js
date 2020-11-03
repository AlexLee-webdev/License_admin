import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Avatar,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  Typography,
  withStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
// import FinanceDialog from "./FinanceDialog";
import request from "../../../api/request";

const styles = (theme) => ({
  tableWrapper: {
    overflowX: "auto",
  },
  alignRight: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
  },
  blackIcon: {
    color: theme.palette.common.black,
  },
  request: {
    backgroundColor: "rgb(56,188,217)",
    color: "white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "rgb(56,188,217)",
    },
  },
  withdraw: {
    backgroundColor: "rgb(200,33,33)",
    color: "white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "rgb(200,33,33)",
    },
  },
  pending: {
    backgroundColor: "rgb(200,33,153)",
    color: "white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "rgb(200,33,153)",
    },
  },
  completed: {
    backgroundColor: "rgb(135,135,135)",
    color: "white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "rgb(135,135,135)",
    },
  },
  refused: {
    backgroundColor: "rgb(35,25,35)",
    color: "white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "rgb(35,25,35)",
    },
  },
  avatar: {
    width: 28,
    height: 28,
  },
  firstData: {
    paddingLeft: theme.spacing(3),
  },
  iconButton: {
    padding: theme.spacing(1),
  },
  dBlock: {
    display: "block",
  },
  dNone: {
    display: "none",
  },
});

const rows = [
  { id: "icon", numeric: true, label: "" },
  { id: "name", numeric: false, label: "name" },
  { id: "email", numeric: false, label: "email" },
  { id: "mid", numeric: false, label: "Machine ID" },
  { id: "expiry", numeric: false, label: "Expiry" },
  { id: "status", numeric: false, label: "Status" },
  { id: "reqTime", numeric: false, label: "Request Time" },
  {
    id: "actions",
    numeric: false,
    label: "",
  },
];

const rowsPerPage = 25;

function CustomTable(props) {
  // const { pushMessageToSnackbar, classes, selectFinance, targets, setTargets } = props;
  const { pushMessageToSnackbar, classes, selectLicense, type, updateLicense } = props;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  // const [isUpdateTargetLoading, setIsUpdateTargetLoading] = useState(false);

  const [targets, setTargets] = useState([]);
  const history = useHistory();

  const handleRequestSort = useCallback(
    (__, property) => {
      const _orderBy = property;
      let _order = "desc";
      if (orderBy === property && order === "desc") {
        _order = "asc";
      }
      setOrder(_order);
      setOrderBy(_orderBy);
    },
    [setOrder, setOrderBy, order, orderBy]
  );

  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );

  const fetchTargets = useCallback(() => {
    const _targets = [];
    const url = "/license";

    request
      .get(url)
      .then((resp) => {
        if (resp.message) {
          for (var i = 0; i < resp.data.length; i++) {
            var item = resp.data[i];
            // console.log(item);
            const transaction = {
              id: item._id,
              name: item.name,
              email: item.email,
              mid: item.mid,
              expiry: item.expiry,
              status: item.status,
              reqTime:
                typeof item.reqTime !== "undefined"
                  ? new Date(item.reqTime).toLocaleString()
                  : "",
            };
            // target.reqTime = item.reqTime;
            _targets.push(transaction);
            // setTransactions(transactions);
          }
          setTargets(_targets);
        }
        else {
            history.push("/");
        }
      })
      .catch((err) => {
        let message = err.message;
        console.log(message);
        // throw new Error(message);
      });
  }, [setTargets]);

  useEffect(() => {
    selectLicense(type);
    fetchTargets();
  }, [fetchTargets]);

  const updateTarget = useCallback(
    (row, status) => {
      // setIsUpdateTargetLoading(true);
        // setIsUpdateTargetDialogOpen(false);
        // setIsUpdateTargetLoading(false);
      request
        .post("/license/update", {
          id: row.id,
        })
        .then((resp) => {
          // console.log(resp);
          const _targets = [...targets];
          if (resp.message !== false) {
            const index = _targets.findIndex(
              (element) => element.id === row.id
            );
            _targets[index].status = status;

            setTargets(_targets);
            updateLicense();
            pushMessageToSnackbar({
              text: "Your status was changed",
            });
          }
        })
        .catch((err) => {
          let message = err.message;
          console.log(message);
          // throw new Error(message);
        });
    },
    [
      // setIsUpdateTargetDialogOpen,
      // setIsUpdateTargetLoading,
      pushMessageToSnackbar,
      // setTargets,
      // updateTargetDialogRow,
      targets,
    ]
  );

  const onAccept = (row) => {
    updateTarget(row, 1);
  };

  const onRollback = (row) => {
    updateTarget(row, 0);
  };

  // const getStatus = (row) => ({
  //   deposit: (
  //     <Button
  //       className={classes.deposit}
  //       onClick={() => {
  //         handleUpdateTargetDialogOpen(row);
  //       }}
  //     >
  //       deposit
  //     </Button>
  //   ),
  //   withdraw: (
  //     <Button
  //       className={classes.withdraw}
  //       onClick={() => {
  //         handleUpdateTargetDialogOpen(row);
  //       }}
  //     >
  //       withdraw
  //     </Button>
  //   ),
  //   pending: (
  //     <Button
  //       className={classes.pending}
  //       onClick={() => {
  //         handleUpdateTargetDialogOpen(row);
  //       }}
  //     >
  //       pending
  //     </Button>
  //   ),
  //   completed: (
  //     <Button
  //       className={classes.completed}
  //       // onClick={() => {
  //       //   handleUpdateTargetDialogOpen(row);
  //       // }}
  //     >
  //       completed
  //     </Button>
  //   ),
  //   refused: (
  //     <Button
  //       className={classes.refused}
  //       onClick={() => {
  //         handleUpdateTargetDialogOpen(row);
  //       }}
  //     >
  //       refused
  //     </Button>
  //   ),
  // });

  return (

    <Accordion expanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>License</Typography>
      </AccordionSummary>
      {/* <FinanceDialog
        open={isUpdateTargetDialogOpen}
        title="Finance"
        content={
          updateTargetDialogRow ? (
            <span>
              {"User "}
              <b>{updateTargetDialogRow.name}</b>
              {" needs to "}
              <b>{updateTargetDialogRow.reqStatus}</b>
              {". Do you accept it?"}
            </span>
          ) : null
        }
        onClose={handleUpdateTargetDialogClose}
        // onConfirm={updateTarget}
        onConfirm={onAccept}
        onPending={onPending}
        onRefuse={onRefuse}
        loading={isUpdateTargetLoading}
      /> */}
      <Box width="100%">
        <div className={classes.tableWrapper}>
          {targets.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={targets.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(targets, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.firstData}
                      >
                        <Avatar
                          className={classes.avatar}
                          src={row.profilePicUrl}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.email}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.mid}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.expiry}
                      </TableCell>
                      {/* <TableCell component="th" scope="row">
                        {getStatus(row)[row.status]}
                      </TableCell> */}
                      <TableCell component="th" scope="row">
                        {row.status ? (
                          <Button
                            className={classes.completed}
                            onClick={() => {
                              onRollback(row);
                            }}
                          >
                            complete
                          </Button>
                        ) : (
                          <Button
                            className={classes.request}
                            onClick={() => {
                              onAccept(row);
                            }}
                          >
                            Accept
                          </Button>
                        )}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.reqTime}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <Box m={2}>
              <HighlightedInformation>
                No licenses added yet.
              </HighlightedInformation>
            </Box>
          )}
        </div>
        <div className={classes.alignRight}>
          <TablePagination
            component="div"
            count={targets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onChangePage={handleChangePage}
            classes={{
              select: classes.dNone,
              selectIcon: classes.dNone,
              actions: targets.length > 0 ? classes.dBlock : classes.dNone,
              caption: targets.length > 0 ? classes.dBlock : classes.dNone,
            }}
            labelRowsPerPage=""
          />
        </div>
      </Box>
    </Accordion>
  );
}

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.number.isRequired,
  updateLicense: PropTypes.func,
  pushMessageToSnackbar: PropTypes.func,
  selectLicense: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(CustomTable);
