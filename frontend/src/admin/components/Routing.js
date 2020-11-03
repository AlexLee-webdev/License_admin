import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core";
// import Dashboard from "./dashboard/Dashboard";
import Settings from "./dashboard/Settings";
import AddUser from "./dashboard/AddLicense";
import License from "./dashboard/License";
// import Subscription from "./subscription/Subscription";
import PropsRoute from "../../shared/components/PropsRoute";

const styles = (theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    width: "auto",
    [theme.breakpoints.up("xs")]: {
      // width: "95%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      // width: "90%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      // width: "82.5%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("lg")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      // width: "70%",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
});

function Routing(props) {
  const {
    classes,
    pushMessageToSnackbar,
    settings,
    setSettings,
    selectSettings,
    selectCreate,
    selectLicense,
    // transactions,
    updateTransactions,
  } = props;
  return (
    <div className={classes.wrapper}>
      <Switch>
        <PropsRoute
          path="/admin/create"
          component={AddUser}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectCreate={selectCreate}
        />
        <PropsRoute
          path="/admin/settings"
          component={Settings}
          pushMessageToSnackbar={pushMessageToSnackbar}
          targets={settings}
          setTargets={setSettings}
          selectSettings={selectSettings}
        />
        <PropsRoute
          path=""
          component={License}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectLicense={selectLicense}
          updateLicense={updateTransactions}
        />
      </Switch>
    </div>
  );
}

Routing.propTypes = {
  classes: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
  // transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateTransactions: PropTypes.func.isRequired,
  selectSettings: PropTypes.func.isRequired,
  selectCreate: PropTypes.func.isRequired,
  selectLicense: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Routing));
