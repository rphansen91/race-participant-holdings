import { createStore, applyMiddleware, compose } from "redux";
import { createWeb3 } from "../web3";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import raceSaga from "./reducers/race";
import userSaga from "./reducers/user";
import snackbarSaga from "./reducers/snackbar";

const sagaMiddware = createSagaMiddleware()
const middleware = [
  sagaMiddware
];

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware)
  // other store enhancers if any
);

export default () => {
    const web3 = createWeb3();
    const store = createStore(reducers, enhancer);
    sagaMiddware.run(raceSaga, web3);
    sagaMiddware.run(userSaga, web3);
    sagaMiddware.run(snackbarSaga, web3);
    return store;
}
