import React, { memo, useCallback, useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core";
import Routing from "./Routing";
import NavBar from "./navigation/NavBar";
import ConsecutiveSnackbarMessages from "../../shared/components/ConsecutiveSnackbarMessages";
import smoothScrollTop from "../../shared/functions/smoothScrollTop";
// import persons from "../dummy_data/persons";
// import { data } from "jquery";
// import LazyLoadAddBalanceDialog from "./subscription/LazyLoadAddBalanceDialog";
import request from "../../api/request";

const styles = (theme) => ({
  main: {
    marginLeft: theme.spacing(9),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
});

function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [requests, setRequests] = useState(0);
  const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
  
  const [settings, setSettings] = useState({});
  
  const fetchSettings = useCallback(() => {
    // Default values
    var settings = {
      amount: 1000,
      fee: 3,
      selected: 60,
      judging: 30
    };
    setSettings(settings);
  }, [setSettings]);

  const updateSettings = useCallback(() => {
  }, [setSettings]);

  const fetchTransactions = useCallback(() => {
    request
      .get("/license/requestPending")
      .then((resp) => {
        if (resp.message) {
          setRequests(resp.data);
        }
      })
      .catch((err) => {
        let message = err.message;
        console.log(message);
        // throw new Error(message);
      });

  }, [setRequests]);

  const updateTransactions = useCallback(() => {
    fetchTransactions();
  }, [setRequests]);

  const selectSettings = useCallback(() => {
    smoothScrollTop();
    // document.title = "BTC - Posts";
    setSelectedTab("Settings");
  }, [setSelectedTab]);

  const selectCreate = useCallback(() => {
    smoothScrollTop();
    setSelectedTab("Create");
  }, [setSelectedTab]);

  const selectLicense = useCallback((type) => {
    smoothScrollTop();
    setSelectedTab("License");
  }, [setSelectedTab]);

  const getPushMessageFromChild = useCallback(
    (pushMessage) => {
      setPushMessageToSnackbar(() => pushMessage);
    },
    [setPushMessageToSnackbar]
  );

  useEffect(() => {
    fetchSettings();
    fetchTransactions();
  }, [
    fetchSettings,
    fetchTransactions,
  ]);

  return (
    <Fragment>
      {/* <LazyLoadAddBalanceDialog
        open={isAddBalanceDialogOpen}
        onClose={closeAddBalanceDialog}
        onSuccess={onPaymentSuccess}
      /> */}
      <NavBar
        selectedTab={selectedTab}
        // messages={messages}
        requests={requests}
      />
      <ConsecutiveSnackbarMessages
        getPushMessageFromChild={getPushMessageFromChild}
      />
      <main className={classNames(classes.main)}>
        <Routing
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectSettings={selectSettings}
          selectCreate={selectCreate}
          selectLicense={selectLicense}
          settings={settings}
          setSettings={updateSettings}
          // transactions={transactions}
          updateTransactions={updateTransactions}
        />
      </main>
    </Fragment>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));
