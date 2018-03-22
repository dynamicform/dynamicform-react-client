import { applyMiddleware, createStore,combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import history from './history';

import formReducer from '../../src/reducers/formReducer';

const middleware = applyMiddleware(thunk,routerMiddleware(history));

export default createStore(
    combineReducers({
        formReducer,
        router: routerReducer,
    }),
    middleware
);