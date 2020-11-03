import React, { Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import store from "./store/configureStore";

import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import * as serviceWorker from "./serviceWorker";
import Pace from "./shared/components/Pace";
import "./assets/css/nucleo-icons.css";
// import { Layout } from "./admin/common/layout";


// const AdminComponent = lazy(() => import("./admin/components/Main"));
const AdminComponent = lazy(() => import("./admin/components/Main"));
const UserComponent = lazy(() => import("./user/components/Main"));

function App() {
  return (
    // <Provider store={store}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />        
          <GlobalStyles />
          <Pace color={theme.palette.primary.light} />
          <Suspense fallback={<Fragment />}>
            <Switch>
              {/* <Route path="/trade">
                <TradeComponent />
              </Route> */}
              <Route path="/admin">
                <AdminComponent />
              </Route>
              {/* <Route path="/admin" name="Home" component={Layout} /> */}
              <Route>
                <UserComponent />
              </Route>
            </Switch>
          </Suspense>
        </MuiThemeProvider>
      </BrowserRouter>
    // </Provider>
  );
}

serviceWorker.register();

export default App;
