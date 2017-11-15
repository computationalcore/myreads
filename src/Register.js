import React from 'react';
import {
	Step,
	Stepper,
	StepLabel,
	StepContent,
} from 'material-ui/Stepper';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import EntropyInput from './EntropyInput';
import AccountQRCode from './AccountQRCode';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactWindowResizeListener from 'window-resize-listener-react';

const style = {
	margin: 12,
};

/**
 * A contrived example using a transition between steps
 */
class Register extends React.Component {

	constructor() {
		super();
		this.state = {
			loading: false,
			stepIndex: 0,
			accountKey: '',
			accountAddress: '',
			stepperOrientation: 'vertical',
		};
	}

	checkStepper = () => {
		this.setState({stepperOrientation: ((innerWidth < 570) ? 'vertical':'horizontal') });
	};

	componentWillMount(){
		this.setState({stepperOrientation: ((innerWidth < 570) ? 'vertical':'horizontal') });
	}

	resizeHandler = () => {
		this.checkStepper();
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
			this.props.onComplete(this.state.accountAddress, this.props.history);
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

	/**
	 * Execute when the Entropy input is complete. The parameter is an object with the account address and
	 * the WIF key ( https://en.bitcoin.it/wiki/Wallet_import_format )
	 * @param accountData
	 */
	handleEntropyComplete = (accountData) => {
		this.setState({accountKey: accountData.wif, accountAddress: accountData.address},function stateUpdateComplete() {
			this.handleNext();
		}.bind(this));
	};

	getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return (
					<div>
						<p>To create your account move the cursor randomly inside box bellow for a while, until
							it is completely green</p>
						<div>
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

	renderStepActions(stepIndex) {
		return (
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
		);
	}

	renderContent() {
		const {stepIndex} = this.state;
		const contentStyle = {margin: '0 16px', overflow: 'hidden'};

		return (
			<div style={contentStyle}>
				<div>{this.getStepContent(stepIndex)}</div>
				{this.renderStepActions(stepIndex)}
			</div>
		);
	}

	render() {
		const {loading, stepIndex} = this.state;

		return (
			<div>
				<ReactWindowResizeListener onResize={this.resizeHandler} />

				<div style={{width: '100%', maxWidth: 1200, margin: 'auto'}}>

					{(this.state.stepperOrientation === 'horizontal') &&
						<div>
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
					}
					{(this.state.stepperOrientation === 'vertical') &&
					<div>
						<Stepper activeStep={stepIndex} orientation="vertical">
							<Step>
								<StepLabel>Swipe to create account</StepLabel>
								<StepContent>
									{this.getStepContent(0)}
									{this.renderStepActions(0)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>Save the Access Key</StepLabel>
								<StepContent>
									{this.getStepContent(1)}
									{this.renderStepActions(1)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>Congratulations</StepLabel>
								<StepContent>
									{this.getStepContent(2)}
									{this.renderStepActions(2)}
								</StepContent>
							</Step>
						</Stepper>
					</div>
					}
				</div>
			</div>
		);
	}
}

export default Register;
