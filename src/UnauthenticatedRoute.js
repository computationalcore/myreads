import React from 'react';
import * as BookUtils from './BookUtils';
import { Route, Redirect } from 'react-router-dom';

/**
 * @description Private routes let the component available only if the user is NOT logged. If the user is logged
 * it will redirect to the main page.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {function} props.render The render function that must run if the user is not logged.
 * @param {Object} props.rest The rest of props available to be included at the route.
 */
const UnauthenticatedRoute = ({ render, ...rest }) => {

	let privateRender;

	if (!BookUtils.isLogged()) {
		privateRender = render;
	}
	else {
		privateRender = (props) => (
			<Redirect to={{
				pathname: '/',
				state: { from: props.location }
			}}/>
		)
	}

	return(
		<Route {...rest} render={privateRender} />
	);
};

export default UnauthenticatedRoute;