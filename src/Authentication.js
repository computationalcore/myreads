import React from 'react';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

/**
 * @description The Authentication Page.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 */
function Authentication(props) {
	return (
		<div className="app-authentication">
			<div className="app-authentication-internal">
			<p>Welcome to MyReads!</p>
			<p>This is a bookshelf app that allow users to select and categorize books they had read, are currently
				reading, or want to read.</p>
			<p>This is the final assessment project for the Udacity's React Fundamentals course, part of the <a
				href="https://udacity.com/course/react-nanodegree--nd019/" target="_blank">
				React Nanodegree Program</a></p>
			<div className="auth-button-ext">
				<Link className="auth-button" to="/login">
					<RaisedButton
						label="Login"
						primary={true}
					/>
				</Link>
				<br/>
				<br/>
				<Link className="auth-button" to="/register">
					<RaisedButton
						label="Register"
						primary={true}
					/>
				</Link>
			</div>
			<p className="important-note">
				Important: The backend API provided by Udacity eventually clean internal data which consequently resets
				the account data.
				This is just an evaluation project not intended to be use in daily basis.
			</p>
			</div>
		</div>
	);
}

export default Authentication;