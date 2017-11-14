import React from 'react';
import * as BookUtils from './BookUtils';
import { Route, Redirect } from 'react-router-dom';

/**
 * Private routes let the component available only if the user is NOT logged. If the user is logged
 * it will redirect to the main page.
 * @param Component
 * @param rest
 * @constructor
 */
const UnauthenticatedRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		!(BookUtils.isLogged()) ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/',
				state: { from: props.location }
			}}/>
		)
	)}/>
);

export default UnauthenticatedRoute;