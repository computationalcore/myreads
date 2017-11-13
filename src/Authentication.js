import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

/**
 * Authentication Page
 * @param props
 * @returns {XML}
 * @constructor
 */
function Authentication(props) {
	return (
		<div className="app-authentication">
			<p>Welcome to MyReads!</p>
			<p>This is a bookshelf app that allow users to select and categorize books they have read, are currently reading, or
				want to read.</p>
			<p>This is the final assessment project for the Udacity's React Fundamentals course</p>
			<div className="auth-button-ext">
				<Link className="auth-button" to="/login">
					<RaisedButton
						label="Login"
						primary={true}
					/>
				</Link>
				<br />
				<br />
				<Link className="auth-button" to="/register">
					<RaisedButton
						label="Register"
						primary={true}
					/>
				</Link>
			</div>
			<p className="important-note">
				Important: The backend API provided by Udacity eventually delete the accounts.
				This is just an evaluation project not intended to be use in daily basis.
			</p>
		</div>
	);
}

export default Authentication;