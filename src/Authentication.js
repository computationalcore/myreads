import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

/**
 * Authentication Page
 * @param props
 * @returns {XML}
 * @constructor
 */
function Authentication(props) {
	return (
		<div className="loader-box">
			<div>
				<Link to="/login">
					<RaisedButton
						label="Login"
						primary={true}
					/>
				</Link>
			</div>
			<div>
				<Link to="/login">
					<RaisedButton
						label="Register"
						primary={true}
					/>
				</Link>
			</div>
		</div>
	);
}

export default Authentication;