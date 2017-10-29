import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './App.css';

const styles = {
	button: {
		marginRight: 12,
	}
};

function ConfirmDialog(props) {

	// Confirm Dialog buttons
	const dialogActions = [
		<FlatButton
			label="Cancel"
			style={styles.button}
			onClick={props.onCancel}
		/>,
		<FlatButton
			label="Confirm"
			backgroundColor="#FF9584"
			hoverColor="#FF583D"
			style={styles.button}
			onClick={props.onConfirm}
		/>,
	];

	return (
		<div>
			<Dialog
				title={props.title}
				actions={dialogActions}
				modal={true}
				open={props.open}
			>
				{props.message}
			</Dialog>
		</div>
	);
}

ConfirmDialog.propTypes = {
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;