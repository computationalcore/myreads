import React from 'react';
import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import EntropyInput from './EntropyInput';
import AccountQRCode from './AccountQRCode';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as BookUtils from './BookUtils';

const style = {
	margin: 12,
};

/**
 * A contrived example using a transition between steps
 */
class Register extends React.Component {

	state = {
		loading: false,
		stepIndex: 0,
		accountKey: '',
		accountAddress: '',
	};

	dummyAsync = (cb) => {
		this.setState({loading: true}, () => {
			this.asyncTimer = setTimeout(cb, 500);
		});
	};

	handleNext = () => {
		const {stepIndex} = this.state;

		// Account Creation Finished
		if (stepIndex >= 2){
			this.handleComplete();
		}

		if (!this.state.loading) {
			this.dummyAsync(() => this.setState({
				loading: false,
				stepIndex: stepIndex + 1,
			}));
		}
	};

	handlePrev = () => {
		const {stepIndex} = this.state;
		if (!this.state.loading) {
			this.dummyAsync(() => this.setState({
				loading: false,
				stepIndex: stepIndex - 1,
			}));
		}
	};

	handleEntropyComplete = (accountData) => {
		this.setState({accountKey: accountData.wif, accountAddress: accountData.address},function stateUpdateComplete() {
			this.handleNext();
		}.bind(this));
	};

	/**
	 * Save Address in local storage and proceed to
	 */
	handleComplete = () => {
		BookUtils.saveAccountAddress(this.state.address);
		this.props.history.push('/');
	};

	getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return (
					<div>
						<p>To create your account move the cursor randomly inside box bellow for a while, until
							it is completely green</p>
						<div style={{marginTop:-50}}>
							<EntropyInput onComplete={this.handleEntropyComplete} />
						</div>
					</div>
				);
			case 1:
				return (
					<div style={{textAlign: 'center'}}>
						<p>Please Download and Save this QR code that contains the access key or copy the key from the box
							it before proceed.</p>
						<p>This Access Key is the only login credential you need.</p>
						<div>
							<AccountQRCode value={this.state.accountKey} />
						</div>
						<p>You can also Copy/Paste the key somewhere or send it to your email</p>
						<div className="account-backup">
							<div className="account-address">{this.state.accountKey}</div>
							<CopyToClipboard text={this.state.accountKey}>
							<RaisedButton style={style} label="Copy to clipboard" />
							</CopyToClipboard>
							<RaisedButton
								style={style}
								href={"mailto:?subject=MyReads%20Account%20Credentials&body=This is your access key for MyReads: " + this.state.accountKey}
								label="Send to your email" />
						</div>
						<p className="account-note">Note: If you lost this key will not be able to recover your account.</p>
					</div>
				);
			case 2:
				return (
					<div style={{textAlign: 'center'}}>
						<p className="account-congratulations">Congratulations!</p>
						<p>
							If you already saved your access key feel free to continue.</p>
						<p>I hope you enjoy the app!</p>
					</div>
				);
			default:
				return 'You\'re a long way from home sonny jim!';
		}
	}

	renderContent() {
		const {stepIndex} = this.state;
		const contentStyle = {margin: '0 16px', overflow: 'hidden'};

		return (
			<div style={contentStyle}>
				<div>{this.getStepContent(stepIndex)}</div>
				<div style={{marginTop: 24, marginBottom: 12}}>
					{/* Show stepper control only after the first step */}
					{(stepIndex >= 1) &&
						<div style={{textAlign: 'center'}}>
							<FlatButton
								label="Back"
								disabled={stepIndex === 0}
								onClick={this.handlePrev}
								style={{marginRight: 12}}
							/>
							<RaisedButton
								label={stepIndex === 2 ? 'Finish' : 'Next'}
								primary={true}
								onClick={this.handleNext}
							/>
						</div>
					}
				</div>
			</div>
		);
	}

	render() {
		const {loading, stepIndex} = this.state;

		return (
			<div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
				<Stepper activeStep={stepIndex}>
					<Step>
						<StepLabel>Swipe to create account</StepLabel>
					</Step>
					<Step>
						<StepLabel>Save the Access Key</StepLabel>
					</Step>
					<Step>
						<StepLabel>Congratulations</StepLabel>
					</Step>
				</Stepper>
				<ExpandTransition loading={loading} open={true}>
					{this.renderContent()}
				</ExpandTransition>
			</div>
		);
	}
}

export default Register;
