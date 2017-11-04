import React from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import Loader from 'react-loader-advanced';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import './App.css';
import DotLoader from './icons/loaders/dots.svg';
import * as BookUtils from './BookUtils';
import BookRating from './BookRating';

const styles = {
	checkbox: {
		marginBottom: 16,
		backgroundColor: 'white'
	},
};

function Book(props) {

	return (
		<div className="book">
			<div className="book-top">
				{/* Show Loader if book is updating */}
				<Loader show={props.updating}
						message={<span><img src={DotLoader} width="50" alt=""/><div>Updating</div></span>}>
					<div className="book-cover" style={{
						width: 128,
						height: 193,
						backgroundImage: `url(${props.image})`
					}}>
						{props.withRibbon && props.shelf &&
						<div className="ribbon">
							<div className="txt">
								<div className={`ribbon ribbon-top-right ribbon-${props.shelf.toLowerCase()}`}>
									<span>
										{BookUtils.getBookshelfCategoryName(props.shelf).split(" ", 2)[0]}
									</span>
								</div>
							</div>
						</div>}
					</div>
				</Loader>
				<div className="book-select-box">
					<CSSTransitionGroup
						transitionName="move-book-animation"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={500}>
						{props.selectMode && <Checkbox
							style={styles.checkbox}
							checked={props.selected}
							onCheck={(event, isInputChecked) => {
								if (isInputChecked) {
									props.onSelectBook();
								}
								else {
									props.onDeselectBook();
								}
							}}
						/>}
					</CSSTransitionGroup>
				</div>
				<CSSTransitionGroup
					transitionName="move-book-animation"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{!props.selectMode && !props.updating &&
					<div>
						<div className="book-shelf-changer">
							<IconMenu
								onItemTouchTap={(event, value) => {
									// Call informed function with the shelf value to be updated
									props.onUpdate(value.key);
								}}
								iconButtonElement={
									<FloatingActionButton mini={true}>
										<NavigationExpandMoreIcon/>
									</FloatingActionButton>
								}>
								<MenuItem primaryText="Move to..." disabled={true}/>
								<Divider/>
								{BookUtils.getBookshelfCategories().filter(shelf => shelf !== (props.shelf)).map((shelf) => (
									<MenuItem key={shelf}
											  value={shelf}
											  primaryText={BookUtils.getBookshelfCategoryName(shelf)}/>
								))}
								{/* Show only if belong to any shelf other than none */}
								{( ('shelf' in props) && (props.shelf !== 'none')) && <MenuItem key="none"
																								value="none"
																								primaryText="None"/>}
							</IconMenu>
						</div>
					</div>
					}
				</CSSTransitionGroup>
			</div>
			<div className="book-rating-container">
				<BookRating
					value={props.averageRating}
					count={props.ratingsCount}
				/>
			</div>
			<div className="book-title">{props.title}</div>
			<div className="book-authors">
				{('authors' in props) ? props.authors.join(', ') : ''}
			</div>
		</div>
	);
}

Book.propTypes = {
	// Title of the book
	title: PropTypes.string.isRequired,
	// Book Cover Image
	image: PropTypes.string.isRequired,
	// Shelf category that the book belongs to
	shelf: PropTypes.string,
	// Authors of the book (some magazines don' have any value for this field for example)
	authors: PropTypes.array,
	// Average value of the ratings of the book
	averageRating: PropTypes.number,
	// Total number of the ratings of the book
	ratingsCount: PropTypes.number,
	// Indicating if the update layer would be visible or not
	updating: PropTypes.bool.isRequired,
	// Indicating if the book is in select mode or note
	selectMode: PropTypes.bool.isRequired,
	// If the Book is in select mode, indicate if it should appears as selected or not
	selected: PropTypes.bool.isRequired,
	// If the Book is in select mode, indicate the function to call when the book is selected
	onSelectBook: PropTypes.func,
	// If the Book is in select mode, indicate the function to call when the book is deselected
	onDeselectBook: PropTypes.func,
	// Indicate if ribbon should be presented on top of the cover image indicating the book shelf category
	withRibbon: PropTypes.bool.isRequired,
	// Call when book should be updated
	onUpdate: PropTypes.func.isRequired,
};

export default Book;