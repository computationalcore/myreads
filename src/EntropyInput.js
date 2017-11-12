import React, {Component} from 'react';
import Bigi from 'bigi';
import Bitcoin from 'bitcoinjs-lib';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import ReactCursorPosition from 'react-cursor-position';

class EntropyInput extends Component {

	static propTypes = {
		value: PropTypes.string,
		onComplete: PropTypes.func,
	};

	static defaultProps = {
		value: Math.random().toString(36),
	};

	state = {
		entropy: [],
		progress: 0,
	};

	/**
	 * Run everytime the cursor position change, passing the new position to this function.
	 * @param position
	 */
	handlePositionChange = ({position}) => {
		this.setState(state => {
			if(this.state.entropy.length < 500) {
				const entropy = state.entropy;
				entropy.push(position.y.toString() + position.x.toString());
				return {entropy: entropy, progress: Math.round(entropy.length/2)}
			}
		},function stateUpdateComplete() {
			if(this.state.progress >= 100) {
				const hash = Bitcoin.crypto.sha256(this.props.value+this.state.entropy);
				const keyPair = new Bitcoin.ECPair(Bigi.fromBuffer(hash));
				this.props.onComplete({wif: keyPair.toWIF(),address: keyPair.getAddress()});
			}
		}.bind(this));
	};
	render() {
		return (
			<div>
				<Paper className="entropy-paper" zDepth={3}>
					<ReactCursorPosition
						className="entropy-swipe"
						isActivatedOnTouch
						pressDuration={1}
						hoverDelayInMs={500}
						onPositionChanged={this.handlePositionChange}
					>
						<div className="entropy-progress-bar" style={{width: `${this.state.progress*86/100}%`}}></div>
						<div className="entropy-text">
							<p>Swipe Here</p>
							<p>{this.state.progress}%</p>
						</div>
					</ReactCursorPosition>
				</Paper>
			</div>
		);
	}
}

export default EntropyInput;