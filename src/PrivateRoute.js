import React from 'react';
import * as BookUtils from './BookUtils';
import { Route, Redirect } from 'react-router-dom';

/**
 * Private routes let the component available only if the user is logged. If not redirect to the authentication page.
 * @param render
 * @param rest
 * @constructor
 */
const PrivateRoute = ({ render, ...rest }) => {

	let privateRender;

	if (BookUtils.isLogged()) {
		privateRender = render;
	}
	else {
		privateRender = (props) => (
			<Redirect to={{
					pathname: '/authentication',
					state: { from: props.location }
				}}/>
			)
	}

	return(
		<Route {...rest} render={privateRender} />
	);
};

export default PrivateRoute;