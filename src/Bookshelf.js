import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import Checkbox from 'material-ui/Checkbox';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';
import LoaderBox from './Loader';
import Book from './Book';
import * as BookUtils from './BookUtils';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	books: PropTypes.array.isRequired,
	category: PropTypes.oneOf(BookUtils.getBookshelfCategories()),
	request: PropTypes.oneOf(Object.values(BookUtils.request)),
	title: PropTypes.string,
	withRibbon: PropTypes.bool,
	withShelfMenu: PropTypes.bool,
	onUpdateBook: PropTypes.func.isRequired,
	onUpdateBookError: PropTypes.func,
	onConnectionError: PropTypes.func,
};

/**
 * This object sets default values to the optional props.
 */
const defaultProps = {
	category: null,
	request: BookUtils.request.OK,
	title: null,
	withRibbon: false,
	withShelfMenu: true,
	onUpdateBookError: () => {},
	onConnectionError: () => {},
};

/**
 * This callback type is called `updateBook` and is displayed as a global symbol.
 *
 * @callback updateBook
 * @param {Object} book - The book object.
 * @param {string} shelf - The id of the shelf.
 */

/**
 * This callback type is called `updateBookError` and is displayed as a global symbol.
 *
 * @callback updateBookError
 */

/**
 * This callback type is called `connectionError` and is displayed as a global symbol.
 *
 * @callback connectionError
 * @param {string} shelf - The id of the shelf.
 */

/**
 * @description Represents the Bookshelf element, with the books from the shelf category
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object[]} props.books - List of books that belongs to the shelf.
 * @param {number} [props.category=null] - The id of the category of the shelf.
 * @param {number} [props.request=OK] - The API request state.
 * @param {string} [props.title=null] - The title of the shelf.
 * @param {boolean} [props.withRibbon=false] - Indicates whether the ribbon is present on top of each book.
 * @param {boolean} [props.withShelfMenu=true] - Indicates whether the shelf menu is present.
 * @param {updateBook} props.onUpdateBook - The callback executed when the update book is triggered.
 * @param {updateBookError} [props.onUpdateBookError] - The callback executed if the update fails.
 * @param {connectionError} [props.onConnectionError] - The callback executed if the a connection error happens.
 */
class Bookshelf extends Component {

	constructor(props){
		super(props);

		/**
		 * @typedef {Object} ComponentState
		 * @property {boolean} selectMode - Indicates if the select mode is active.
		 * @property {Object[]} selectedBooks - Array of selected books.
		 * @property {boolean} dialogOpen - Visibility of the clear shelf dialog.
		 * @property {boolean} alertDialogOpen - Visibility of the error alert dialog.
		 * @property {string} query - Search query input of the shelf internal search.
		 * @property {boolean} queryMode -  Indicates if the shelf's books search is active.
		 */

		/** @type {ComponentState} */

		this.state = {
			selectMode: false,
			selectedBooks: [],
			dialogOpen: false,
			alertDialogOpen: false,
			query: '',
			queryMode: false,
		};
	}

	/**
	 * @description Enable the select books mode.
	 */
	enableSelectMode = () => {
		if (!this.state.selectMode) {
			this.setState({selectMode: true, query: '', queryMode: false});
		}
	};

	/**
	 * @description Disable the select books mode.
	 */
	disableSelectMode = () => {
		if (this.state.selectMode) {
			this.setState({selectMode: false, selectedBooks: []});
		}
	};

	/**
	 * @description Insert the book into the selectedBooks state array.
	 * @param {object} book - The Book object.
	 */
	selectBook = (book) => {
		// If books state array is not empty
		if (this.state.selectMode) {
			this.setState(state => ({
				selectedBooks: state.selectedBooks.filter(b => b.id !== book.id).concat([book])
			}));
		}
	};

	/**
	 * @description Copy all books from the shelf to the selectedBooks state array.
	 */
	selectAllBooks = () => this.setState({selectedBooks: this.props.books});

	/**
	 * @description Clear selectedBooks state array.
	 */
	deselectAllBooks = () => this.setState({selectedBooks: []});

	/**
	 * @description Remove book from the selectedBooks state array.
	 * @param {object} book - The book object.
	 */
	deselectBook = (book) => {
		// If books state array is not empty
		if (this.state.selectMode) {
			this.setState(state => ({
				selectedBooks: state.selectedBooks.filter(b => b.id !== book.id)
			}));
		}
	};

	/**
	 * @description Update shelf value of the books from selectedBooks state array to the informed value.
	 * @param {string} shelf - The id of the shelf.
	 */
	updateBooks = (shelf) => {
		const onUpdateBook = this.props.onUpdateBook;
		const selectedBooks = this.state.selectedBooks;
		this.setState({selectMode: false, selectedBooks: []});
		selectedBooks.forEach(function (book) {
			onUpdateBook(book, shelf);
		});
	};

	/**
	 * @description Open the Clear shelf dialog.
	 */
	handleDialogOpen = () => {
		this.setState({dialogOpen: true});
	};

	/**
	 * @description Close the Clear shelf dialog.
	 */
	handleDialogClose = () => {
		this.setState({dialogOpen: false});
	};

	/**
	 * @description Remove all books from the shelf.
	 */
	clearShelf = () => {
		let onUpdateBook = this.props.onUpdateBook;
		this.props.books.forEach(function (book) {
			onUpdateBook(book, 'none');
		});
		// Close the Clear dialog
		this.handleDialogClose();
		this.setState({selectMode: false, query: '', queryMode: false});
	};


	/**
	 * @description Update search query input.
	 * @param {string} query - The search term.
	 */
	updateSearchQuery = (query) => {
		this.setState({ query: query.trim() })
	};

	/**
	 * @description	Toggle the search mode activation.
	 */
	handleSearchCheck = () => {
		this.setState((state) => {
			return {
				queryMode: !state.queryMode,
				query: '',
			};
		}, function stateUpdateComplete() {
			this.searchInput.focus();
		}.bind(this));
	};

	render() {
		const {
			books,
			category,
			onUpdateBook,
			onConnectionError,
			onUpdateBookError,
			request,
			title,
			withRibbon,
			withShelfMenu
		} = this.props;

		const selectMode = this.state.selectMode && (request === BookUtils.request.OK);
		const { query, queryMode } = this.state;
		let showingBooks;
		if (query && queryMode) {
			// Escape regex elements converting to literal strings, and 'í' to ignore case
			const match = new RegExp(escapeRegExp(query), 'i');
			showingBooks = books.filter((book) => match.test(book.title));
			showingBooks.sort(sortBy('title'));
		} else {
			showingBooks = books;
		}

		return (
			<div>
				{/* Shelf Toolbar */}
				<Toolbar>
					<ToolbarGroup>
						<img className="shelf-bar-icon" src={BookUtils.getBookshelfCategoryIcon(category)} alt=""/>
						<ToolbarTitle
							text={((title === null) ? BookUtils.getBookshelfCategoryName(category) : title) + ' (' +
							books.length +')'}/>
					</ToolbarGroup>
					{/* Only show shelf menu if this props is true */}
					{withShelfMenu && (books.length > 0) &&
					<ToolbarGroup>
						{!selectMode &&
						<div style={{width: 20}}>
							<Checkbox
								checkedIcon={<SearchIcon style={{color: 'blue'}}/>}
								uncheckedIcon={<SearchIcon/>}
								checked={this.state.queryMode}
								onCheck={this.handleSearchCheck}
							/>
						</div>
						}
						<ToolbarSeparator/>
						{/* Shelf Menu Options */}
						{!selectMode &&
						<IconMenu
							iconButtonElement={
								<IconButton touch={true}>
									<MoreVertIcon/>
								</IconButton>
							}
						>
							<MenuItem primaryText="Move Books" onClick={this.enableSelectMode}/>
							<MenuItem primaryText="Clear Shelf" onClick={this.handleDialogOpen}/>
						</IconMenu>
						}
						{/* Close Select Mode Button */}
						{selectMode &&
						<IconButton touch={true} onClick={this.disableSelectMode}>
							<NavigationClose/>
						</IconButton>
						}
					</ToolbarGroup>
					}
				</Toolbar>
				{/* Clear Books Confirmation Dialog */}
				<ConfirmDialog
					title="Clear Shelf"
					message={'Are you sure you want to remove all books from the "' +
					BookUtils.getBookshelfCategoryName(category) + '" shelf?'}
					onCancel={this.handleDialogClose}
					onConfirm={this.clearShelf}
					open={this.state.dialogOpen}
				/>
				{/* Alert Dialog when have problems with book update server response */}
				<AlertDialog
					message="Unable to update book data from server (Maybe internet connection or server instability)"
					onClick={onUpdateBookError}
					open={request === BookUtils.request.BOOK_ERROR}
				/>
				{/* Shelf Loader */}
				<div className="shelf-loader-box">
					<LoaderBox loading={request === BookUtils.request.LOADING} size={70} message="Loading Books"/>
				</div>

				<ol className="shelf-book-list">
					{/* Select Book Controls */}
					<CSSTransitionGroup
						transitionName="book-select-mode"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}>
						{selectMode &&
						<div>
							<div className="select-mode-controls">
								<RaisedButton className="select-mode-button" label="Select All" primary={true}
											  disabled={
												  (this.state.selectedBooks.length === books.length) ? true : false
											  }
											  onClick={this.selectAllBooks}/>
								<RaisedButton className="select-mode-button" label="Clear All" secondary={true}
											  disabled={
												  (this.state.selectedBooks.length === 0) ? true : false
											  }
											  onClick={this.deselectAllBooks}/>
							</div>
							<div className="select-mode-controls">
								<CSSTransitionGroup
									transitionName="book-select-box-move"
									transitionEnterTimeout={500}
									transitionLeaveTimeout={300}>
									{(this.state.selectedBooks.length > 0) &&
									<div>
										<SelectField
											floatingLabelText={'Move ' + (this.state.selectedBooks.length > 1 ? 'Books':
												'Book') + " to"}
											value={this.state.value}
											onChange={(event, index, value) => (this.updateBooks(value))}
										>
											<Subheader>Move Book to...</Subheader>
											{BookUtils.getBookshelfCategories().filter(shelf => shelf !== category).map(
												(shelf) => (
													<MenuItem key={shelf} value={shelf}>
														<img className="app-book-menu-shelf-icon"
															 src={BookUtils.getBookshelfCategoryIcon(shelf)}
															 alt=""
														/>
														<span>{BookUtils.getBookshelfCategoryName(shelf)}</span>
													</MenuItem>
												)
											)}
											<MenuItem key="none" value="none">
												<img src="/myreads/icons/shelves/none.svg" className="app-book-menu-remove-icon" alt=""
													 width={30}/>
												<span>None</span>
											</MenuItem>
										</SelectField>
									</div>}
								</CSSTransitionGroup>
							</div>
						</div>}
					</CSSTransitionGroup>

					{/* Show when shelf is empty */}
					{(books.length === 0) && (request === BookUtils.request.OK) &&
					<div className="shelf-message-text">
						No Books available
					</div>
					}
					{/* Show when shelf have problems getting data from server */}
					{(books.length === 0) && (request === BookUtils.request.ERROR) &&
					<div className="shelf-message-text">
						<div>Unable to fetch data from server</div>
						<div>(Maybe internet connection or server instability)</div>
						<RaisedButton label="Try Again" primary={true} onClick={onConnectionError}/>
					</div>
					}
					{/* Search Books Input */}
					<CSSTransitionGroup
						transitionName="search-shelf-mode"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}>
						{(this.state.queryMode) &&
						<div className="search-shelf">
							<TextField
								ref={(input) => {
									this.searchInput = input;
								}}
								className="search-shelf-input"
								hintText="Enter the search term"
								floatingLabelText="Search"
								onChange={(event) => this.updateSearchQuery(event.target.value)}
							/>
						</div>
						}
					</CSSTransitionGroup>
					{/* Show when search results are empty */}
					{(books.length > 0) && (showingBooks.length === 0) &&
					<div className="shelf-message-text">
						No Results
					</div>
					}
					{/* Book List */}
					<CSSTransitionGroup
						transitionName="move-book-animation"
						className="books-grid"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}>
						{showingBooks.map((book) => (
							<li key={book.id}>
								<Book
									id={book.id}
									title={book.title}
									image={book.imageLinks.thumbnail}
									shelf={(book.shelf) ? book.shelf : 'none'}
									authors={('authors' in book) ? book.authors : []}
									averageRating={(book.averageRating) ? book.averageRating : 0}
									ratingsCount={(book.ratingsCount) ? book.ratingsCount : 0}
									updating={('updating' in book) ? book.updating : false}
									selectMode={this.state.selectMode}
									selected={(this.state.selectedBooks.filter(b => b.id === book.id).length > 0)}
									withRibbon={withRibbon}
									onSelectBook={() => this.selectBook(book)}
									onDeselectBook={() => this.deselectBook(book)}
									onUpdate={(shelf) => (onUpdateBook(book, shelf))}
								/>
							</li>
						))}
					</CSSTransitionGroup>
				</ol>
			</div>
		);
	}
}

// Type checking the props of the component
Bookshelf.propTypes = propTypes;
// Assign default values to the optional props
Bookshelf.defaultProps = defaultProps;

export default Bookshelf;