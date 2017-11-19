import React from 'react';
import PropTypes from 'prop-types';
import CircleLoader from './icons/loaders/circle.svg';
import ClockLoader from './icons/loaders/clock.svg';
import DotsLoader from './icons/loaders/dots.svg';

const type = ['clock','dots','circle'];
const loaders = [ClockLoader, DotsLoader, CircleLoader];

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	loading: PropTypes.bool,
	size: PropTypes.number,
	type: PropTypes.oneOf(type),
	message: PropTypes.string,
};

/**
 * This object sets default values to the optional props.
 */
const defaultProps = {
	loading: false,
	size: 36,
	type: type[0],
	message: '',
};

/**
 * @description Represents a loader box, a square box with loading image and loading text.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {boolean} props.loading - Visibility of the component.
 * @param {number} props.size - The size in pixel of the box.
 * @param {type} props.type - The type of the loader.
 * @param {string} props.message - The message to be displayed with the box.
 */
function LoaderBox(props) {
	if (!props.loading) {
		return null;
	}
	let style = {};
	if (props.size) {
		style = {width: props.size, height: props.size};
	}
	let loaderType;
	if (!props.type) {
		loaderType = type[0];
	}
	else{
		loaderType = props.type;
	}
	return (
		<div className="loader-box">
			<div>
				<img src={loaders[type.indexOf(loaderType)]} className="loader-box-svg" style={style} alt="Loader"/>
			</div>
			{props.message &&
			<div>
				{props.message}
			</div>
			}
		</div>
	);
}

// Type checking the props of the component
LoaderBox.propTypes = propTypes;
// Assign default values to the optional props
LoaderBox.defaultProps = defaultProps;

export default LoaderBox;