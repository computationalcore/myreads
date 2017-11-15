import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './App.css';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	message: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	onClick: PropTypes.func,
};

/**
 * This object sets default values to the optional props.
 */
const defaultProps = {
	onClick: () => {
	},
};

/**
 * This callback type is called `clickCallback` and is displayed as a global symbol.
 *
 * @callback clickCallback
 */

/**
 * @description Represents a material UI based Alert Dialog with an OK button.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} props.message - The message to be displayed by the dialog.
 * @param {boolean} props.open - The dialog visibility.
 * @param {clickCallback} [props.function] - The callback to be executed when user clicks the OK button.
 */
function AlertDialog(props) {
	return (
		<div>
			<Dialog
				actions={
					<FlatButton
						label="OK"
						onClick={props.onClick}
					/>
				}
				modal={true}
				open={props.open}
			>
				{props.message}
			</Dialog>
		</div>
	);
}

// Type checking the props of the component
AlertDialog.propTypes = propTypes;
// Assign default values to the optional props
AlertDialog.defaultProps = defaultProps;

export default AlertDialog;