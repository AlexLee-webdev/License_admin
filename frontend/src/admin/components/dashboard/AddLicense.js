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
  withStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import withWidth from "@material-ui/core/withWidth";
import Bordered from "../../../shared/components/Bordered";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";


const styles = (theme) => ({
  numberInput: {
    width: 300,
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

class AddLicense extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      mid: "",
      expiry: "3",
      // status: "active",
      isSaveLoading: false,
      isDefaultLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setIsSaveLoading = this.setIsSaveLoading.bind(this);
    this.setIsDefaultLoading = this.setIsDefaultLoading.bind(this);
  }

  componentDidMount() {
    this.props.selectCreate();
  }

  checkValid() {
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const regExp2 = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    var msg = "";
        
    if (this.state.name === "" || this.state.name === undefined) {
      msg = "Please enter the name.";
    } else if (this.state.email === "" || this.state.email === undefined) {
      msg = "Please enter email.";
    } else if (
      this.state.email.match(regExp) === null ||
      this.state.email.match(regExp) === undefined
    ) {
      msg = "Please enter it according to the email format.";
    }

    if (msg !== "") {
      this.props.pushMessageToSnackbar({
        text: msg
      });
      return false;
    }
    return true;
  }

  onSubmit() {
    this.setIsSaveLoading(true);

    if (this.checkValid() === false) return;

    var targets = {
      name: this.state.name,
      email: this.state.email,
      mid: this.state.mid,
      expiry: parseInt(this.state.expiry),
    };
    setTimeout(() => {
      this.setIsSaveLoading(false);
    }, 1500);
    request
    .post("/license/create", targets)
    .then((resp) => {
      if (resp.mesage) {      
        this.props.pushMessageToSnackbar({
          text: "A new license request have been created",
        });          
        this.setState(
          {name: "", email: "", mid: ""}
          );
        }
        else {
          this.props.pushMessageToSnackbar({
            text: resp.message
          });
        }
    })
    .catch((err) => {
      let message = err.message;
      throw new Error(message);
    });
  }

  componentWillUnmount() {}

  setIsSaveLoading(isSave) {}
  setIsDefaultLoading(isDefault) {}

  handleChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case "name": {
        this.setState({ name: value });
        break;
      }
      case "email": {
        this.setState({ email: value });
        break;
      }
      case "mid": {
        this.setState({ mid: value });
        break;
      }
      case "expiry": {
        this.setState({ expiry: value });
        break;
      }
      default:
        throw new Error("No branch selected in switch statement.");
    }
  }

  render() {
    const { classes } = this.props;
    const { isSaveLoading, isDefaultLoading } = this.state;

    return (
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Add License</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.dBlock}>
          <List disablePadding>
            <Bordered disableVerticalPadding disableBorderRadius>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">Name</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <OutlinedInput
                      labelWidth={0}
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      className={classes.numberInput}
                      classes={{ input: classes.numberInputInput }}
                    />
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">E-Mail</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <OutlinedInput
                      labelWidth={0}
                      name="email"
                      type="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      className={classes.numberInput}
                      classes={{ input: classes.numberInputInput }}
                    />
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">Machine ID</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <OutlinedInput
                      labelWidth={0}
                      name="mid"
                      type="mid"
                      value={this.state.passwd}
                      onChange={this.handleChange}
                      className={classes.numberInput}
                      classes={{ input: classes.numberInputInput }}
                    />
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
              <ListItem className="listItemLeftPadding" disableGutters divider>
                <ListItemText>
                  <Typography variant="body2">Expiry date</Typography>
                </ListItemText>
                <FormControl variant="outlined">
                  <ListItemSecondaryAction
                    className={classes.ListItemSecondaryAction}
                  >
                    <Select
                      value={this.state.level}
                      onChange={this.handleChange}
                      input={
                        <OutlinedInput
                          name="expiry"
                          labelWidth={0}
                          className={classes.numberInput}
                          classes={{ input: classes.numberInputInput }}
                        />
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {["3", "5", "10"].map((element) => (
                        <MenuItem value={element} key={element}>
                          {element}
                        </MenuItem>
                      ))}
                    </Select>
                  </ListItemSecondaryAction>
                </FormControl>
              </ListItem>
            </Bordered>
          </List>
        </AccordionDetails>
        <AccordionDetails className={classes.AccordionDetails}>
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

AddLicense.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  selectCreate: PropTypes.func.isRequired,
};

export default withWidth()(withStyles(styles, { withTheme: true })(AddLicense));
