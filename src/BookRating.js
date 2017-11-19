import React from 'react';
import PropTypes from 'prop-types';
import StarRatingComponent from 'react-star-rating-component';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	value: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
};

/**
 * @description Represents a star rating component that support full and half star (0.5 unity values).
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {number} props.value - The average value of the ratings.
 * @param {number} props.count - The total number of ratings.
 */
function BookRating(props) {
	return (
		<div className="book-rating">
			{/* The name props is the radio input value, it required but only is important if the editing is true, since
			the application will not allow this component to have editable value it will be set as a random value */}
			<StarRatingComponent
				name={Math.random().toString(36)}
				className="book-rating-star"
				starCount={5}
				value={props.value}
				editing={false}
				starColor="#ffb400"
				emptyStarColor="#ffb400"
				renderStarIcon={(index, value) => {
					return <span className={index <= value ? 'fa fa-star' : 'fa fa-star-o'}/>;
				}}
				renderStarIconHalf={() => <span className="fa fa-star-half-full"/>}
			/>
			<span className="book-rating-counter">({props.count})</span>
		</div>
	);
}

// Type checking the props of the component
BookRating.propTypes = propTypes;

export default BookRating;