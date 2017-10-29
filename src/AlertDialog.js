import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './App.css';

function AlertDialog(props) {

	// Confirm Dialog buttons
	const dialogActions = [
		<FlatButton
			label="OK"
			onClick={props.onClick}
		/>
	];

	return (
		<div>
			<Dialog
				actions={dialogActions}
				modal={true}
				open={props.open}
			>
				{props.message}
			</Dialog>
		</div>
	);
}

AlertDialog.propTypes = {
	message: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	onClick: PropTypes.func,
};

export default AlertDialog;