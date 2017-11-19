import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import QrReader from 'react-qr-reader';
import SwipeableViews from 'react-swipeable-views';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import * as BookUtils from './BookUtils';
import AlertDialog from './AlertDialog';

/**
 * @description	The Login page component.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 */
class Login extends Component {

	constructor(props){
		super(props);

		/**
		 * @typedef {Object} ComponentState
		 * @property {number} delay - The delay between each scan in milliseconds.
		 * @property {string} facingMode - If the device have multiple cameras this sets which camera is selected.
		 * @property {boolean} legacyMode - Enable the scan based on uploaded image only.
		 * @property {boolean} cameraError - Indicates whether an error camera happened.
		 * @property {string} dialogMessage - The alert dialog message.
		 * @property {number} slideIndex - The index of the tab.
		 * @property {boolean} submitDisabled - Indicates whether submit is disabled.
		 * @property {boolean} inputVisible - The visibility of the account key input.
		 */

		/** @type {ComponentState} */
		this.state = {
			delay: 300,
			facingMode: 'user',
			legacyMode: false,
			cameraError: false,
			dialogMessage: '',
			slideIndex: 0,
			submitDisabled: true,
			inputVisible: false,
		};
		this.handleScan = this.handleScan.bind(this);
	}

	/**
	 * @description Handle the scan from the QR code reader.
	 * @param {string} data - The data from the QR code reader after a scan.
	 */
	handleScan = (data) => {
		const errorMessage = 'Not found any valid QRCode format for the Access Key. Please try a valid image.';
		if(data){
			this.saveAddress(data, errorMessage);
		}
		else if (this.state.legacyMode) {
			this.saveAddress('', errorMessage);
		}
	};

	/**
	 * @description If the app couldn't read the camera. Errors cause can vary from user not giving permission to access
	 * camera, by the absence of camera or WebRTC is not supported by the browser.
	 * @param {Object} err - The QR code reader error object.
	 */
	handleError = (err) => {
		this.setState({
			cameraError: true
		});
		console.error(err);
	};

	/**
	 * @description Enable QrCode code reader legacy mode to be able to upload images and open upload dialog.
	 */
	handleImageLoad = () => {
		// Set the QrCode reader to legacy mode for the upload to be available
		this.setState({legacyMode: true},function stateUpdateComplete() {
			// Show the upload dialog to choose the file
			this.qrReader.openImageDialog();
		}.bind(this));
	};

	/**
	 * @description If the user environment have two cameras (like mobile phones with frontal and rear camera) it allows
	 * to switch. The user can also disable the camera and it will set the state to legacy mode (upload file mode).
	 * between them.
	 * @param event
	 * @param index
	 * @param value
	 */
	handleCameraChange = (event, index, value) => {
		if(value !== 'disabled') {
			this.setState({facingMode: value, legacyMode: false});
		}
		else {
			this.setState({facingMode: value, legacyMode: true});
		}

	};

	/**
	 * @description Hide the alert dialog.
	 */
	hideDialog = () => {
		this.setState({
			dialogMessage: '',
		});
	};


	/**
	 * @description Validate the the WIF, generate the address and proceed to main app screen. If the fails the dialog
	 * with the errorMessage will be displayed.
	 * @see {@link https://en.bitcoin.it/wiki/Wallet_import_format}
	 * @param {string} wif - The key in WIF format.
	 * @param {string} errorMessage - Error message to be displayed if the WIF key is not correct.
	 */
	saveAddress = (wif, errorMessage) => {
		try {
			// It will work if the WIF is correct
			const address =  BookUtils.getAddress(wif);
			this.props.onComplete(address, this.props.history);
		}
		catch (e) {
			// If WIF is invalid format
			this.setState({
				dialogMessage: errorMessage,
			});
		}
	};

	/**
	 * @description Handle account key submit button.
	 */
	handleKeySubmit = () => {
		this.saveAddress(this.keyInput.input.value, 'Not a valid access key. Please enter a valid value.');
	};

	/**
	 * @description Handle tab switch.
	 * @param {number} value - The index of the tab slide.
	 */
	handleChange = (value) => {
		this.setState({
			slideIndex: value,
		});
	};

	/**
	 * @description Handle the Account Key TextField input change. It enable the submit button if field is not empty or
	 * disable it otherwise.
	 * @param event
	 * @param value
	 */
	handleTextFieldChange = (event, value) => {
		if((value.length > 0) && this.state.submitDisabled){
			this.setState({submitDisabled: false});
		}
		else if((value.length === 0) && !this.state.submitDisabled){
			this.setState({submitDisabled: true});
		}
	};

	/**
	 * @description Change the visibility of the access key text input.
	 */
	handleVisibilityCheck = () => {
		this.setState((state) => {
			return {
				inputVisible: !state.inputVisible,
			};
		});
	};

	render() {
		return (
			<div style={{textAlign: 'center'}}>
				<AlertDialog
					open={(this.state.dialogMessage.length > 0)}
					message={this.state.dialogMessage}
					onClick={this.hideDialog}
				/>
				<p className="login-header">Use the QrCode backup OR the Access Key. If you don't have an account <Link
					to="/register">Register Here</Link>.</p>
				<Tabs
					onChange={this.handleChange}
					value={this.state.slideIndex}
				>
					<Tab label="Scan the QR Code" value={0}/>
					<Tab label="Enter the Key" value={1}/>
				</Tabs>
				<SwipeableViews
					index={this.state.slideIndex}
					onChangeIndex={this.handleChange}
				>
					<div>
						{!this.state.cameraError &&
						<SelectField
							floatingLabelText="Select Camera"
							value={(this.state.legacyMode) ? 'disabled' : this.state.facingMode}
							onChange={this.handleCameraChange}
						>
							<MenuItem value="user" primaryText="User Camera"/>
							<MenuItem value="environment" primaryText="Environment Camera"/>
							<MenuItem value="disabled" primaryText="Disable Camera"/>
						</SelectField>
						}
						<QrReader
							className="qr-reader"
							ref={(qrReader) => {
								this.qrReader = qrReader;
							}}
							delay={this.state.delay}
							onError={this.handleError}
							onScan={this.handleScan}
							legacyMode={this.state.legacyMode}
							facingMode={this.state.facingMode}
						/>
						{this.state.cameraError &&
						<div className="account-note">Error reading the camera, try to upload the QRCode Image with the
							button bellow</div>
						}
						<div>OR</div>
						<RaisedButton
							label="Upload the QRCode image"
							primary={true}
							onClick={this.handleImageLoad}
						/>
					</div>
					<div>
						<p>Enter the Access Key</p>
						<TextField
							type={(this.state.inputVisible) ? 'text' : 'password'}
							style={{maxWidth: 700, width: '80%', display: 'inline-block'}}
							ref={(keyInput) => {
								this.keyInput = keyInput;
							}}
							hintText="Enter the access key"
							floatingLabelText="Access Key"
							onChange={this.handleTextFieldChange}
						/>
						<Checkbox
							onCheck={this.handleVisibilityCheck}
							checked={this.state.inputVisible}
							style={{maxWidth: 40, width: '20%', display: 'inline-block'}}
							checkedIcon={<Visibility/>}
							uncheckedIcon={<VisibilityOff/>}
						/>
						<div>
							<RaisedButton
								label="Submit"
								primary={true}
								disabled={this.state.submitDisabled}
								onClick={this.handleKeySubmit}
							/>
						</div>
					</div>
				</SwipeableViews>
			</div>
		)
	}
}

export default Login;
