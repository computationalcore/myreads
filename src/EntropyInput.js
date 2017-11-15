import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Bigi from 'bigi';
import Bitcoin from 'bitcoinjs-lib';
import Paper from 'material-ui/Paper';
import ReactCursorPosition from 'react-cursor-position';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	value: PropTypes.string,
	onComplete: PropTypes.func,
};

/**
 * This object sets default values to the optional props.
 */
const defaultProps = {
	value: Math.random().toString(36),
};

/**
 * This callback type is called `entropyCallback` and is displayed as a global symbol.
 *
 * @callback entropyCallback
 * @param {Object} accountData - The object with account information.
 * @param {Object} accountData.wif - The key in WIF format.
 * @param {Object} accountData.address - The account address.
 */

/**
 * @description Represents an entropy input element that get users mouse/finger movements to get extra entropy and
 * generate a unique key (WIF format) and address (bitcoin address format)
 * @see {@link https://bitcoin.org/en/developer-guide#distributing-only-wallets}
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} [props.value] - The string value to be used with the random entry.
 * @param {entropyCallback} props.onComplete - The callback executed when the entropy is complete (100%).
 */
class EntropyInput extends Component {

	constructor(props){
		super(props);

		/**
		 * @typedef {Object} ComponentState
		 * @property {Object[]} entropy - Extra entropy array of cursor position object.
		 * @property {number} progress - Percent of the progress based on the entropy array size.
		 */

		/** @type {ComponentState} */
		this.state = {
			entropy: [],
			progress: 0,
		};
	}

	/**
	 * @description Run every time the cursor position change, passing the new position to this function.
	 * @param {Object} position - The position pair (x,y) of the cursor.
	 */
	handlePositionChange = ({position}) => {
		this.setState(state => {
			if( (this.state.entropy.length < 500) ) {
				const entropy = state.entropy;
				entropy.push(position.y.toString() + position.x.toString());
				return {entropy: entropy, progress: Math.round(entropy.length/2)}
			}
		},function stateUpdateComplete() {
			if(this.state.progress === 100) {
				const hash = Bitcoin.crypto.sha256(this.props.value+this.state.entropy);
				const keyPair = new Bitcoin.ECPair(Bigi.fromBuffer(hash));
				this.props.onComplete({wif: keyPair.toWIF(),address: keyPair.getAddress()});
			}
		}.bind(this));
	};

	render() {
		const progress = (this.state.progress < 100) ? this.state.progress: 100;
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
						<div className="entropy-progress-bar"
							 style={{width: `${progress}%`}} />
						<div className="entropy-text">
							<p>Swipe Here</p>
							<p>{progress}%</p>
						</div>
					</ReactCursorPosition>
				</Paper>
			</div>
		);
	}
}

// Type checking the props of the component
EntropyInput.propTypes = propTypes;
// Assign default values to the optional props
EntropyInput.defaultProps = defaultProps;

export default EntropyInput;