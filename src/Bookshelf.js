import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import Loader from 'react-loader-advanced';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import './App.css';
import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';
import DotLoader from './icons/loaders/dots.svg';
import LoaderBox from './Loader';

/**
 * Array of the available bookshelf categories IDs.
 * @type {[string,string,string]}
 */
const BOOKSHELF_CATEGORY_IDS = [
	'currentlyReading',
	'wantToRead',
	'read',
];

/**
 *  Array of the available bookshelf categories names.
 *  The index matches the BOOKSHELF_CATEGORY_IDS
 * @type {[string,string,string]}
 */
const BOOKSHELF_CATEGORY_NAMES = [
	'Currently Reading',
	'Want to Read',
	'Read',
];

/**
 * Get the array of all available bookshelf categories IDs
 */
export const getBookshelfCategories = () => BOOKSHELF_CATEGORY_IDS;

/**
 * Return the bookshelf category name of the informed id or '' if the id doesn't belong to any category.
 * @param categoryId
 * @returns string
 */
export const getBookshelfCategoryName = (categoryId) => {
	const categoryInternalIndex = BOOKSHELF_CATEGORY_IDS.indexOf(categoryId);

	if (categoryInternalIndex === -1) {
		// If Category doesn't exists returns ''
		return '';
	}

	return BOOKSHELF_CATEGORY_NAMES[categoryInternalIndex];
};

const styles = {
	block: {
		maxWidth: 250,
	},
	checkbox: {
		marginBottom: 16,
		backgroundColor: 'white'
	},
	button: {
		marginRight: 12,
	},
	iconButton: {
		width: 20,
		height: 20,
	},
	medium: {
		width: 24,
		height: 24,
		padding: 2,
		backgroundColor: 'white'
	}
};

const loadingOptions = [null, 'loading', 'error', 'update_book_error'];

class Bookshelf extends Component {

	static propTypes = {
		// List of books that belongs to the shelf
		books: PropTypes.array.isRequired,
		title: PropTypes.string,
		// Category ID of the shelf
		category: PropTypes.oneOf(BOOKSHELF_CATEGORY_IDS),
		onUpdateBook: PropTypes.func.isRequired,
		onUpdateBookError: PropTypes.func,
		onConnectionError: PropTypes.func,
		loading: PropTypes.oneOf(loadingOptions),
		/* If the shelf should present shelf attribute ribbon on each book */
		withRibbon: PropTypes.bool,
		/* If clear shelf is available as an option in shelf menu */
		withShelfMenu: PropTypes.bool,
	};

	state = {
		selectMode: false,
		selectedBooks: [],
		dialogOpen: false,
		alertDialogOpen: false,
	};

	enableSelectMode = () => {
		// If books state array is not empty
		if (!this.state.selectMode) {
			// Update book state to include loading variable used at updating animation
			this.setState({selectMode: true});
		}
	};

	disableSelectMode = () => {
		// If books state array is not empty
		if (this.state.selectMode) {
			// Update book state to include loading variable used at updating animation
			this.setState({selectMode: false, selectedBooks: []});
		}
	};

	/**
	 * @description Insert informed book into the selectedBooks state array
	 * @param {object} book
	 */
	selectBook = (book) => {
		// If books state array is not empty
		if (this.state.selectMode) {
			console.log('Select Book');

			this.setState(state => ({
				selectedBooks: state.selectedBooks.filter(b => b.id !== book.id).concat([book])
			}));
		}
	};

	/**
	 * @description copy all books from the shelf to the selectedBooks state array
	 */
	selectAllBooks = () => this.setState({selectedBooks: this.props.books});

	/**
	 * @description clear selectedBooks state array
	 */
	deselectAllBooks = () => this.setState({selectedBooks: []});

	/**
	 * @description Remove informed book from the selectedBooks state array
	 * @param {object} book
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
	 * @param {string} shelf
	 */
	updateBooks = (shelf) => {
		let onUpdateBook = this.props.onUpdateBook;
		let selectedBooks = this.state.selectedBooks;
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
	};

	render() {
		const {books, title, onUpdateBook, onConnectionError, withRibbon, withShelfMenu} = this.props;

		const selectMode = this.state.selectMode && !(this.props.loading);

		return (
			<div>
				{/* Shelf Toolbar */}
				<Toolbar>
					<ToolbarGroup>
						<ToolbarTitle text={(title === null) ? getBookshelfCategoryName(this.props.category) : title}/>
					</ToolbarGroup>
					{/* Only show shelf menu if this props is true */}
					{withShelfMenu && (books.length > 0) &&
						<ToolbarGroup>
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
					title={'Clear Shelf'}
					message={'Are you sure you want to remove all books from the "' +
					getBookshelfCategoryName(this.props.category) + '" shelf?'}
					onCancel={this.handleDialogClose}
					onConfirm={this.clearShelf}
					open={this.state.dialogOpen}
				/>
				{/* Alert Dialog when have problems with book update server response */}
				<AlertDialog
					message='Unable to update book data from server (Maybe internet connection or server instability)'
					onClick={this.props.onUpdateBookError}
					open={this.props.loading === loadingOptions[3]}
				/>
				{/* Shelf Loader */}
				<div className="shelf-loader-box">
					<LoaderBox loading={this.props.loading === loadingOptions[1]} size={70} message="Loading Books"/>
				</div>

				<ol>
					{/* Select Book Controls */}
					<CSSTransitionGroup
						transitionName="book-select-mode"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}>
						{selectMode &&
						<div>
							<div className="select-mode-controls">
								<RaisedButton label="Select All" primary={true} style={styles.button}
											  disabled={
												  (this.state.selectedBooks.length === this.props.books.length) ? true : false
											  }
											  onClick={this.selectAllBooks}/>
								<RaisedButton label="Clear All" secondary={true} style={styles.button}
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
											floatingLabelText={"Move " + (this.state.selectedBooks.length > 1 ? 'Books' : 'Book') + " to"}
											value={this.state.value}
											onChange={(event, index, value) => (this.updateBooks(value)) }
										>
											{BOOKSHELF_CATEGORY_IDS.filter(shelf => shelf !== this.props.category).map((shelf) => (
												<MenuItem key={shelf}
														  value={shelf} primaryText={getBookshelfCategoryName(shelf)}/>
											))}
											<MenuItem key="none"
													  value="none" primaryText="None"/>
										</SelectField>
									</div>}
								</CSSTransitionGroup>
							</div>
						</div>}
					</CSSTransitionGroup>

					{/* Show when shelf is empty */}
					{(books.length === 0) && !(this.props.loading) &&
					<div className="shelf-message-text">
						No Books available
					</div>
					}
					{/* Show when shelf have problems getting data from server */}
					{(books.length === 0) && (this.props.loading === loadingOptions[2]) &&
					<div className="shelf-message-text">
						<div>Unable to fetch data from server</div>
						<div>(Maybe internet connection or server instability)</div>
						<RaisedButton label="Try Again" primary={true} onClick={onConnectionError}/>
					</div>
					}

					{/* Book List */}
					<CSSTransitionGroup
						transitionName="move-book-animation"
						className="books-grid"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}>
						{books.map((book) => (
							<li key={book.id}>
								<div className="book">
									<div className="book-top">

										<Loader show={('updating' in book) ? book.updating : false}
												message={<span><img src={DotLoader} width="50" alt=""/><div>Updating</div></span>}>
											<div className="book-cover" style={{
												width: 128,
												height: 193,
												backgroundImage: `url(${book.imageLinks.thumbnail})`
											}}>
												{withRibbon && book.shelf &&
												<div className="ribbon">
													<div className="txt">
														<div
															className={`ribbon ribbon-top-right ribbon-${book.shelf.toLowerCase()}`}>
														<span>
															{getBookshelfCategoryName(book.shelf).split(" ", 2)[0]}
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
												{this.state.selectMode && <Checkbox
													style={styles.checkbox}
													checked={(this.state.selectedBooks.filter(b => b.id === book.id).length > 0) ? true : false}
													onCheck={(event, isInputChecked) => {
														if (isInputChecked) {
															this.selectBook(book);
														}
														else {
															this.deselectBook(book);
														}
													}}
												/>}
											</CSSTransitionGroup>
										</div>
										<CSSTransitionGroup
											transitionName="move-book-animation"
											transitionEnterTimeout={500}
											transitionLeaveTimeout={500}>
											{!this.state.selectMode && !(('updating' in book) ? book.updating : false) &&
											<div>
												<div className="book-shelf-changer">
													<IconMenu
														onItemTouchTap={(event, value) => {
															onUpdateBook(book, value.key);
														}}
														iconButtonElement={
															<FloatingActionButton mini={true}>
																<NavigationExpandMoreIcon/>
															</FloatingActionButton>
														}>
														<MenuItem primaryText="Move to..." disabled={true}/>
														<Divider/>
														{BOOKSHELF_CATEGORY_IDS.filter(shelf => shelf !== (('shelf' in book) ? book.shelf : null)).map((shelf) => (
															<MenuItem key={shelf}
																	  value={shelf}
																	  primaryText={getBookshelfCategoryName(shelf)}/>
														))}
														{/* Show only if belong to any shelf other than none */}
														{( ('shelf' in book) && (book.shelf !== 'none')) && <MenuItem key="none"
																						value="none"
																						primaryText="None"/>}
													</IconMenu>
												</div>
											</div>
											}
										</CSSTransitionGroup>
									</div>
									<div className="book-title">{book.title}</div>
									<div className="book-authors">
										{('authors' in book) ? book.authors.join(', ') : ''}
									</div>
								</div>
							</li>
						))}
					</CSSTransitionGroup>
				</ol>
			</div>
		);
	}
}

Bookshelf.defaultProps = {
	title: null,
	withRibbon: false,
	withShelfMenu: true,
};

export default Bookshelf;