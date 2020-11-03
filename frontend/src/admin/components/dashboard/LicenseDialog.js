import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  // DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid
} from "@material-ui/core";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const titleStyle = {
  backgroundColor: "#263042",
  color: "white"
};

const pendingStyle = {
  backgroundColor: "rgb(200,33,153)",
  color: "white",
};

const refuseStyle = {
  backgroundColor: "rgb(35,25,35)",
  color: "white",
  
};
const acceptStyle = {
  backgroundColor: "rgb(200,33,33)",
  color: "white",
};

function FinanceDialog(props) {
  const { open, onPending, onRefuse, onClose, loading, title, content, onConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
    >
      <DialogTitle style={titleStyle}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Grid container direction="row">
          <Grid item xs={6} md={5}>
            <Button style={pendingStyle} onClick={onPending} disabled={loading}>
              Pending
            </Button>
          </Grid>
          <Grid item xs={6} md={5}>
            <Button style={refuseStyle} onClick={onRefuse} disabled={loading}>
              Refuse
            </Button>
          </Grid>
        </Grid>

        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          // color="secondary"
          style={acceptStyle}
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
        >
          Accept {loading && <ButtonCircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FinanceDialog.propTypes = {
  open: PropTypes.bool,
  onPending: PropTypes.func,
  onRefuse: PropTypes.func,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onConfirm: PropTypes.func,
};

export default FinanceDialog;
