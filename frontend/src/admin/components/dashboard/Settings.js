import React from "react";
import PropTypes from "prop-types";
import request from "../../../api/request";

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  Button,
  Accordion,
  AccordionSummary,
  Typography,
  ListItemText,
  OutlinedInput,
  AccordionDetails,
  MenuItem,
  FormControl,
  Select,
  Box,
  withStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import withWidth from "@material-ui/core/withWidth";
import Bordered from "../../../shared/components/Bordered";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const SETTINGS_AMOUNT_MIN = 1000;
const SETTINGS_AMOUNT_MAX = 10000;
const SETTINGS_FEE_MIN = 1;
const SETTINGS_FEE_MAX = 100;

const SETTINGS_AMOUNT_DEF = 1000;
const SETTINGS_FEE_DEF = 3;
const SETTINGS_SELECT_DEF = 60;
const SETTINGS_JUDGING_DEF = 30;

const styles = (theme) => ({
  numberInput: {
    width: 110,
  },
  numberInputInput: {
    padding: "9px 34px 9px 14.5px",
  },
  dBlock: { display: "block" },
  listItemLeftPadding: {
    paddingRight: theme.spacing(3),
  },
  AccordionDetails: {
    paddintTop: theme.spacing(0),
    justifyContent: "flex-end",
  },
});

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 1000,
      fee: 3,
      selected: 60,
      judging: 30,
      isSaveLoading: false,
      isDefaultLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.resetState = this.resetState.bind(this);
    this.onSetDefault = this.onSetDefault.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setIsSaveLoading = this.setIsSaveLoading.bind(this);
    this.setIsDefaultLoading = this.setIsDefaultLoading.bind(this);
  }

  componentDidMount() {
    this.props.selectSettings();
    
    request
      .get("/settings/")
      .then((resp) => {
        if (resp.message) {
          this.setState({
            amount: resp.data.amount,
            fee: resp.data.fee,
            selected: resp.data.selected,
            judging: resp.data.judging,
          });
        } else {
          window.location.href = "/";
        }        
      })
      .catch((err) => {
        let message = err.message;
        console.log(message);
        // throw new Error(message);
      });
  }

  onSubmit() {
    this.setIsSaveLoading(true);
    
    if (this.state.selected <= this.state.judging) {
      this.props.pushMessageToSnackbar({
        text: "Time of selected area should be larger than time of judging area",
      });

      this.setIsSaveLoading(false);
      return;
    }
    var targets = {
      amount: this.state.amount,
      fee: this.state.fee,
      selected: this.state.selected,
      judging: this.state.judging,
    };
    setTimeout(() => {
      this.props.pushMessageToSnackbar({
        text: "Your settings have been saved",
      });
      
      this.setIsSaveLoading(false);
    }, 1500);
    request
      .post("/settings/create", targets)
      .then((resp) => {
        this.props.setTargets(targets);
      })
      .catch((err) => {
        let message = err.message;
        throw new Error(message);
      });
  }

  componentWillUnmount() {

  }

  setIsSaveLoading(isSave) {}
  setIsDefaultLoading(isDefault) {}

  handleKeyPress(event) {
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === "amount") {
      if (value > SETTINGS_AMOUNT_MAX || value < SETTINGS_AMOUNT_MIN) {
        return;
      }
    } else if (name === "fee") {
      // if (value >= SETTINGS_FEE_MAX || value < SETTINGS_FEE_MIN) {
      //   return;
      // }
    }
    switch (name) {
      case "amount": {
        this.setState({ amount: value });
        break;
      }
      case "fee": {
        this.setState({ fee: value });
        break;
      }
      case "selected": {
        let pos = value.indexOf(" sec");
        this.setState({ selected: value.substring(0, pos) });
        break;
      }
      case "judging": {
        let pos = value.indexOf(" sec");
        this.setState({ judging: value.substring(0, pos) });
        break;
      }
      default:
        throw new Error("No branch selected in switch statement.");
    }
  }

  resetState() {
    this.setIsSaveLoading(false);
    this.setIsDefaultLoading(false);
    this.setState({
      amount: SETTINGS_AMOUNT_DEF,
      fee: SETTINGS_FEE_DEF,
      selected: SETTINGS_SELECT_DEF,
      judging: SETTINGS_JUDGING_DEF,
    });
  }

  onSetDefault() {
    this.setIsDefaultLoading(true);
    setTimeout(() => {
      this.props.pushMessageToSnackbar({
        text: "Your settings have been reset to default",
      });
      this.resetState();
    }, 1500);
  }

  render() {
    const { classes } = this.props;
    const { isSaveLoading, isDefaultLoading } = this.state;

    return (
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Settings</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.dBlock}>
          <List disablePadding>
            <Bordered disableVerticalPadding disableBorderRadius>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">Amount</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <OutlinedInput
                      labelWidth={0}
                      name="amount"
                      value={this.state.amount}
                      type="number"
                      onChange={this.handleChange}
                      onKeyPress={(evt) => this.handleKeyPress(evt)}
                      className={classes.numberInput}
                      classes={{ input: classes.numberInputInput }}
                      inputProps={{ step: 20 }}
                    />
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">Fee</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <OutlinedInput
                      labelWidth={0}
                      name="fee"
                      value={this.state.fee}
                      // type="number"
                      onChange={this.handleChange}
                      onKeyPress={(evt) => this.handleKeyPress(evt)}
                      className={classes.numberInput}
                      classes={{ input: classes.numberInputInput }}
                      inputProps={{ step: 1 }}
                    />
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">Selected area range</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <Select
                      value={this.state.selected + " sec"}
                      onChange={this.handleChange}
                      input={
                        <OutlinedInput
                          name="selected"
                          labelWidth={0}
                          className={classes.numberInput}
                          classes={{ input: classes.numberInputInput }}
                        />
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {["120 sec", "90 sec", "60 sec", "30 sec"].map(
                        (element) => (
                          <MenuItem value={element} key={element}>
                            {element}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">Judging area range</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <Select
                      value={this.state.judging + " sec"}
                      onChange={this.handleChange}
                      input={
                        <OutlinedInput
                          name="judging"
                          labelWidth={0}
                          className={classes.numberInput}
                          classes={{ input: classes.numberInputInput }}
                        />
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {["60 sec", "30 sec", "15 sec"].map(
                        (element) => (
                          <MenuItem value={element} key={element}>
                            {element}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
            </Bordered>
          </List>
        </AccordionDetails>
        <AccordionDetails className={classes.AccordionDetails}>
          <Box mr={1}>
            <Button
              onClick={this.onSetDefault}
              disabled={isSaveLoading || isDefaultLoading}
            >
              Default {isDefaultLoading && <ButtonCircularProgress />}
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            disabled={isSaveLoading || isDefaultLoading}
            onClick={this.onSubmit}
          >
            Save {isSaveLoading && <ButtonCircularProgress />}
          </Button>
        </AccordionDetails>
      </Accordion>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  targets: PropTypes.object.isRequired,
  setTargets: PropTypes.func.isRequired,
  selectSettings: PropTypes.func.isRequired,
};

export default withWidth()(withStyles(styles, { withTheme: true })(Settings));
