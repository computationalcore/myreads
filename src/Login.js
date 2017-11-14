import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import QrReader from 'react-qr-reader';
import Bitcoin from 'bitcoinjs-lib';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SwipeableViews from 'react-swipeable-views';
import AlertDialog from './AlertDialog';

class Login extends Component {

	constructor(props){
		super(props);
		this.state = {
			delay: 300,
			result: 'No result',
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
	 * Handle the scan from the QR code reader
	 * @param data
	 */
	handleScan = (data) => {
		if(data){
			this.saveAddress(data, 'Not found any valid QRCode format for the Access Key. Please try a valid image.');
		}
	};

	/**
	 * If the app couldn't read the camera. Errors cause can vary from user not giving permission to access camera, by
	 * the absence of camera or WebRTC is not supported by the browser.
	 * @param err
	 */
	handleError = (err) => {
		this.setState({
			cameraError: true
		});
		console.error(err);
	};

	/**
	 * Enable QrCode code reader legacy mode to be able to upload images and open upload dialog.
	 */
	handleImageLoad = () => {
		// Set the QrCode reader to legacy mode for the upload to be available
		this.setState({legacyMode: true},function stateUpdateComplete() {
			// Show the upload dialog to choose the file
			this.qrReader.openImageDialog();
		}.bind(this));
	};

	/**
	 * If the user environment have two cameras (like mobile phones with frontal and rear camera) it allows to switch.
	 * The user can also disable the camera and it will set the state to legacy mode (upload file mode).
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
	 * Hide the alert dialog.
	 */
	hideDialog = () => {
		this.setState({
			dialogMessage: '',
		});
	};


	/**
	 *  Validate the the WIF, generate the address and proceed to main app screen.
	 *  If the fails the dialog with the errorMessage will be displayed.
	 *  Note: https://en.bitcoin.it/wiki/Wallet_import_format
	 * @param wif
	 * @param errorMessage
	 */
	saveAddress = (wif, errorMessage) => {
		console.log(wif)
		try {
			// It will work if the WIF is correct
			const keyPair = Bitcoin.ECPair.fromWIF(wif);
			const address =  keyPair.getAddress();
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
	 * Handle account key submit
	 */
	handleKeySubmit = () => {
		this.saveAddress(this.keyInput.input.value, 'Not a valid access key. Please enter a valid value.');
	};

	/**
	 * Handle the Account Key TextField input change. It enable the submit button if field is not empty or
	 * disable it otherwise.
	 * @param value
	 */
	handleChange = (value) => {
		this.setState({
			slideIndex: value,
		});
	};

	/**
	 * Handle the Account Key TextField input change. It enable the submit button if field is not empty or
	 * disable it otherwise.
	 * @param event
	 * @param value
	 */
	handleTextFieldChange = (event, value) => {
		console.log(value);
		if((value.length > 0) && this.state.submitDisabled){
			this.setState({submitDisabled: false});
		}
		else if((value.length === 0) && !this.state.submitDisabled){
			this.setState({submitDisabled: true});
		}
	};

	/**
	 * Change the visibility of the access key text input.
	 */
	handleVisibilityCheck = () => {
		this.setState((state) => {
			return {
				inputVisible: !state.inputVisible,
			};
		});
	};

	render(){
		return(
			<div style={{textAlign: 'center'}}>
				<AlertDialog
					open={(this.state.dialogMessage.length > 0)}
					message={this.state.dialogMessage}
					onClick={this.hideDialog}
				/>
				<p className="login-header">Use the QrCode backup OR the Access Key. If you don't have an account <Link to="/register">Register Here</Link>.</p>
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
