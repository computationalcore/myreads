import React from 'react';
import * as BookUtils from './BookUtils';
import { Route, Redirect } from 'react-router-dom';

/**
 * Private routes let the component available only if the user is NOT logged. If the user is logged
 * it will redirect to the main page.
 * @param render
 * @param rest
 * @constructor
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