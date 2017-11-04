import React from 'react';
import PropTypes from 'prop-types';
import StarRatingComponent from 'react-star-rating-component';

function BookRating(props) {

	return (
		<div className="book-rating">
			{ /* This name is the radio input value, it required but only is important if the editing is true, since the application will not allow this component to have editable value it will be set as a random value */}
			<StarRatingComponent
				name={Math.random().toString(36)}
				className="book-rating-star"
				starCount={5}
				value={props.value}
				editing={false}
				starColor="#ffb400"
				emptyStarColor="#ffb400"
				renderStarIcon={(index, value) => {
					return <span className={index <= value ? 'fa fa-star' : 'fa fa-star-o'} />;
				}}
				renderStarIconHalf={() => <span className="fa fa-star-half-full" />}
			/>
			<span className="book-rating-counter">({props.count})</span>
		</div>
	);
}

BookRating.propTypes = {
	/* Average value of the ratings */
	value: PropTypes.number.isRequired,
	/* Number of the ratings count */
	count: PropTypes.number.isRequired,
};

export default BookRating;