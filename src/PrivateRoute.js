import React from 'react';
import * as BookUtils from './BookUtils';
import { Route, Redirect } from 'react-router-dom';

/**
 * Private routes let the component available only if the user is logged. If not redirect to the authentication page.
 * @param Component
 * @param rest
 * @constructor
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		BookUtils.isLogged() ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/authentication',
				state: { from: props.location }
			}}/>
		)
	)}/>
);

export default PrivateRoute;