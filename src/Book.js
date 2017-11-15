import React from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-advanced';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconMenu from 'material-ui/IconMenu';
import Info from 'material-ui/svg-icons/action/info';
import MenuItem from 'material-ui/MenuItem';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Subheader from 'material-ui/Subheader';
import DotLoader from './icons/loaders/dots.svg';
import RemoveIcon from './icons/shelves/none.svg';
import * as BookUtils from './BookUtils';
import BookRating from './BookRating';
import './App.css';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	id: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	updating: PropTypes.bool.isRequired,
	selected: PropTypes.bool.isRequired,
	selectMode: PropTypes.bool.isRequired,
	withRibbon: PropTypes.bool.isRequired,
	onUpdate: PropTypes.func.isRequired,
	authors: PropTypes.array,
	averageRating: PropTypes.number,
	ratingsCount: PropTypes.number,
	shelf: PropTypes.string,
	onSelectBook: PropTypes.func,
	onDeselectBook: PropTypes.func,
};

/**
 * This object sets default values to the optional props.
 */
const defaultProps = {
	authors: [],
	averageRating: 0,
	ratingsCount: 0,
	shelf: 'none',
	onSelectBook: () => {},
	onDeselectBook: () => {},
};

/**
 * This callback type is called `selectBoxCallback` and is displayed as a global symbol.
 *
 * @callback selectBoxCallback
 */

/**
 * This callback type is called `updateCallback` and is displayed as a global symbol.
 *
 * @callback updateCallback
 * @param {string} shelf - The id of the shelf.
 */

/**
 * @description	Represents a Book.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} props.id - The id of the book.
 * @param {string} props.image - The url of the book cover image.
 * @param {string} props.title - The title of the book.
 * @param {boolean} props.updating - Indicates whether the book is updating. Shows the loader layer if true.
 * @param {boolean} props.selected - Indicates whether the book is selected.
 * @param {boolean} props.selectMode - Indicates whether the book is in select mode.
 * @param {boolean} props.withRibbon - Indicates whether the shelf category ribbon is present.
 * @param {updateCallback} props.onUpdate - The callback to be executed when user clicks the OK button.
 * @param {Object[]} [props.authors=[]] - The authors of the book.
 * @param {number} [props.averageRating=0] - The average value of the book ratings.
 * @param {number} [props.ratingsCount=0] - The total number of the book ratings.
 * @param {string} [props.shelf=none] - The shelf category id of which the book belongs.
 * @param {selectBoxCallback} [props.onSelectBook] - The callback to be executed when a book is selected.
 * @param {selectBoxCallback} [props.onDeselectBook] - The callback to be executed when a book is deselected.
 */
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
						{props.withRibbon && (props.shelf !== 'none') &&
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
							className="book-checkbox"
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
								iconButtonElement={
									<FloatingActionButton mini={true}>
										<NavigationExpandMoreIcon/>
									</FloatingActionButton>
								}>
								{/* Link state is used to control if app menu should show home button or back arrow */}
								<Link to={{pathname: `/info/${props.id}`, state: true}}>
									<MenuItem>
										<Info className="app-book-menu-shelf-icon" style={{color: 'grey'}}/>
										<span>Show Book Details</span>
									</MenuItem>
								</Link>
								<Divider/>
								<Subheader>Move Book to...</Subheader>
								{BookUtils.getBookshelfCategories().filter(shelf => shelf !== (props.shelf)).map(
									(shelf) => (
									<MenuItem key={shelf}
											  onClick={() => {
												  // Call informed function with the shelf value to be updated
												  props.onUpdate(shelf);
											  }}>
										<img className="app-book-menu-shelf-icon"
											 src={BookUtils.getBookshelfCategoryIcon(shelf)}
											 alt=""
										/>
										<span>{BookUtils.getBookshelfCategoryName(shelf)}</span>
									</MenuItem>
								))}
								{/* Show only if belong to any shelf other than none */}
								{( !('shelf' in props) || (props.shelf !== 'none')) &&
								<MenuItem key="none"
										  onClick={() => {
											  // Call informed function with the shelf value to be updated
											  props.onUpdate('none');
										  }}>
									<img src={RemoveIcon} className="app-book-menu-remove-icon" alt="" width={30}/>
									<span>None</span>
								</MenuItem>
								}
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

// Type checking the props of the component
Book.propTypes = propTypes;
// Assign default values to the optional props
Book.defaultProps = defaultProps;

export default Book;