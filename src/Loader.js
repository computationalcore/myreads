import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import ClockLoader from './icons/loaders/clock.svg';
import DotsLoader from './icons/loaders/dots.svg';
import CircleLoader from './icons/loaders/circle.svg';

const type = ['clock','dots','circle'];
const loaders = [ClockLoader, DotsLoader, CircleLoader];

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
			<div><img src={loaders[type.indexOf(loaderType)]} className="loader-box-svg" style={style} alt="Loader"/></div>
			{props.message &&
				<div>
					{props.message}
				</div>
			}
		</div>
	);
}

LoaderBox.propTypes = {
	loading: PropTypes.bool,
	size: PropTypes.number,
	type: PropTypes.oneOf(type),
	message: PropTypes.string,
};

export default LoaderBox;