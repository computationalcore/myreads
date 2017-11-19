import React from 'react';
import { Link, Route } from 'react-router-dom';
import sortBy from 'sort-by';
import scrollToComponent from 'react-scroll-to-component';
import AppBar from 'material-ui/AppBar';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import Logout from 'material-ui/svg-icons/action/exit-to-app';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Subheader from 'material-ui/Subheader';
import SvgIcon from 'material-ui/SvgIcon';
import * as BooksAPI from './BooksAPI';
import * as BookUtils from './BookUtils';
import Authentication from './Authentication';
import BookInfo from './BookInfo';
import Bookshelf from './Bookshelf';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import Register from './Register';
import Search from './Search';
import UnauthenticatedRoute from './UnauthenticatedRoute';

/**
 * @description Main App component.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 */
class BooksApp extends React.Component {

	constructor(props){
		super(props);

		/**
		 * @typedef {Object} ComponentState
		 * @property {Object[]} books - All books from the logged account.
		 * @property {number} request - App request state used to represent the API request/response.
		 * @property {boolean} menuOpen - Main Screen menu state.
		 * @property {Object[]} searchResults - All books returned from the search.
		 * @property {string} query - Search term input.
		 */

		/** @type {ComponentState} */
		this.state = {
			books: [],
			request: BookUtils.request.OK,
			menuOpen: false,
			searchResults: [],
			query: '',
		};
	}

	/**
	 * Lifecycle event handler called just after the App loads into the DOM.
	 * Call the API to get all books if the user is logged.
	 */
	componentDidMount() {
		// Execute get books only if user is logged
		if(BookUtils.isLogged()) {
			this.getAllBooks();
		}
	}

	/**
	 * @description: Get all books from the logged user.
	 */
	getAllBooks = () => {
		// Inside catch block the context change so assign like this to reference the app context not the catch context
		const app = this;
		this.setState({request: BookUtils.request.LOADING});
		// Update the Shelves
		BooksAPI.getAll().then((books) => {
			app.setState({books: books, request: BookUtils.request.OK});
		}).catch(function () {
			app.setState({request: BookUtils.request.ERROR});
		});
	};

	/**
	 * @description Change shelf value for a book element from the server data.
	 * @param {Object) book - The book to be updated.
	 * @param {string} shelf - The category ID.
	 */
	updateBook = (book, shelf) => {
		// If books state array is not empty
		if (this.state.books) {

			// Update book state to include updating variable used at book updating animation
			book.updating = true;
			this.setState(state => ({
				books: state.books.filter(b => b.id !== book.id).concat([book]).sort(sortBy('title'))
			}));

			// Inside catch block the context change so assign like this to reference the app context not the catch
			// context
			const app = this;
			// Update book reference at remote server, if successful update local state reference also
			BooksAPI.update(book, shelf).then(() => {
				book.shelf = shelf;
				book.updating = false;
				// This will update all Bookshelf components since it will force call render and the book will move
				// to the correct shelf.
				this.setState(state => ({
					books: state.books.filter(b => b.id !== book.id).concat([book]).sort(sortBy('title'))
				}));
			}).catch(function () {
				// If will remove load animations in case of failure also
				book.updating = false;
				app.setState(state => ({
					books: state.books.filter(b => b.id !== book.id).concat([book]).sort(sortBy('title')),
					request: BookUtils.request.BOOK_ERROR,
				}));
			});
		}
	};

	/**
	 * @description Update the query state and call the search.
	 * @param {string} query - The search term.
	 */
	updateQuery = (query) => {
		// If query is empty or undefined
		if (!query) {
			this.setState({query: '', searchResults: [], request: BookUtils.request.OK});
			return;
		}
		query = query.trim();
		// Update the search field as soon as the character is typed
		this.setState({
			query: query,
			request: BookUtils.request.LOADING,
			searchResults: []
		}, function stateUpdateComplete() {
			this.search();
		}.bind(this));
	};

	/**
	 * @description Search books for the query state.
	 */
	search = () => {
		// Inside catch block the context change so assign like this to reference the app context not the catch
		// context
		const app = this;
		const query = this.state.query;

		BooksAPI.search(query).then((books) => {

			// If the query state (the search input) changed while the request was in process not show the books
			// of a previous query state
			if (query !== this.state.query) return;

			//If the query is empty no need to request to server just clean the books array
			if ('error' in books) {
				books = []
			}
			else {
				/*
				 * Since the search API didn't return the shelf property for a book this will compare with
				 * memory mapped books from the shelves to include the correct shelf attribute.
				 */
				books.map(book => (this.state.books.filter((b) => b.id === book.id).map(b => book.shelf = b.shelf)));
			}
			this.setState({
				searchResults: books.sort(sortBy('title')),
				request: BookUtils.request.OK,
			});
		}).catch(function () {
			// If will remove load animations in case of failure also
			app.setState(state => ({
				searchResults: [],
				request: BookUtils.request.ERROR,
			}));
		});
	};

	/**
	 * @description Save account address into local storage and proceed to main app page.
	 * @param {string} address - The account address.
	 * @param {Object} history - The react router history object.
	 */
	handleLogin = (address,  history) => {
		// Reset any previous stored state data in memory
		this.setState({
			books: [],
			menuOpen: false,
			searchResults: [],
			query: '',
		});
		BookUtils.saveAccountAddress(address);
		history.push('/');
		this.getAllBooks();
	};

	/**
	 * @description Clean the address from local storage and redirect to authentication page.
	 * @param {Object} history - The react router history object.
	 */
	handleLogout = (history) => {
		BookUtils.cleanAccountAddress();
		history.push('/authentication');
	};

	/**
	 * @description Back to previous page and clean some previous page state.
	 * @param {Object} history - The react router history object.
	 */
	goToPrevious = (history) => {
		history.push('/');
		// Clear previous search if go back to home
		this.setState({query: '', searchResults: []});
	};

	/**
	 * @description Change request state to OK in case of pressing OK at dialog after an individual book update failure.
	 */
	handleUpdateBookError = () => {
		this.setState({request: BookUtils.request.OK});
	};

	/**
	 * @description Toggle app menu open/close state.
	 */
	handleMenuToggle = () => {
		this.setState(state => ({
			menuOpen: !state.menuOpen,
		}));
	};

	/**
	 * @description Animated scroll the main page area top to the informed shelf.
	 * @param {string} shelf - The id of the category.
	 */
	goToShelf = (shelf) => {
		this.setState({menuOpen: false}, function stateUpdateComplete() {
			scrollToComponent(this[shelf], {offset: -90, align: 'top', duration: 500, ease: 'inCirc'});
		}.bind(this));
	};

	render() {
		return (
			<MuiThemeProvider>
				<div className="app">
					{/* Main app screen (Bookshelf) */}
					<PrivateRoute exact path="/" render={({history}) => (
						<div className="list-books">
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title app-bar-icon">MyReads</div>}
									iconClassNameRight="muidocs-icon-navigation-expand-more"
									onLeftIconButtonTouchTap={this.handleMenuToggle}
								/>
							</div>
							<Drawer docked={false} open={this.state.menuOpen}
									onRequestChange={(open) => this.setState({'menuOpen': open})}>
								<Menu>
									<Subheader>Go to Shelf</Subheader>
									{BookUtils.getBookshelfCategories().map((shelf) => (
										<MenuItem key={shelf} onClick={() => this.goToShelf(shelf)}>
											<img className="app-menu-shelf-icon"
												 src={BookUtils.getBookshelfCategoryIcon(shelf)}
												 alt={this.props.category}/>
											<span>{BookUtils.getBookshelfCategoryName(shelf)}</span>
										</MenuItem>
									))}
									<Divider/>
									<MenuItem onClick={() => (this.handleLogout(history))}>
										<Logout className="app-menu-shelf-icon" style={{color: 'grey'}}/>
										<span>Logout</span>
									</MenuItem>
								</Menu>
							</Drawer>
							<div className="list-books-content">
								<div>
									{BookUtils.getBookshelfCategories().map((shelf) => (
										<div key={shelf} className="bookshelf"
											 ref={(section) => {
												 this[shelf] = section;
											 }}>
											<Bookshelf
												books={this.state.books.filter((book) => book.shelf === shelf).sort(
													sortBy('title'))}
												category={shelf}
												request={this.state.request}
												onUpdateBook={this.updateBook}
												onUpdateBookError={this.handleUpdateBookError}
												onConnectionError={this.getAllBooks}
											/>
										</div>
									))}
								</div>
							</div>
							<div className="open-search">
								<Link
									to="/search"
									className="add-books"
								>
									<FloatingActionButton>
										<ContentAdd/>
									</FloatingActionButton>
								</Link>
							</div>
						</div>
					)}/>
					{/* Search */}
					<PrivateRoute path="/search" render={({history}) => (
						<div>
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title app-bar-icon">Search</div>}
									iconElementLeft={
										<IconButton>
											<ArrowBack/>
										</IconButton>
									}
									onLeftIconButtonTouchTap={() => (this.goToPrevious(history))}
								/>
							</div>
							<div className="app-content">
								<Search
									books={this.state.searchResults}
									query={this.state.query}
									onSearch={this.search}
									onUpdateQuery={this.updateQuery}
									onUpdateBook={this.updateBook}
									request={this.state.request}
									onUpdateBookError={this.handleUpdateBookError}
								/>
							</div>
						</div>
					)}/>
					{/* BookInfo page */}
					<Route exact path="/info/:bookId"
						   render={({history, match: {params: {bookId}}, location: {state}}) => (
							   <div>
								   <div className="app-bar">
									   <AppBar
										   title={<div className="app-bar-title app-bar-icon">Book Details</div>}
										   iconElementLeft={
											   <IconButton>
												   {state &&
												   <ArrowBack/>
												   }
												   {!state &&
												   <SvgIcon>
													   <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
												   </SvgIcon>
												   }
											   </IconButton>
										   }
										   onLeftIconButtonTouchTap={
											   () => {
												   // Go Back
												   if (state)
													   history.goBack();
												   // Go to Home
												   else {
													   history.push("/");
												   }
											   }
										   }
									   />
								   </div>
								   <div className="app-content">
									   <BookInfo id={bookId}/>
								   </div>
							   </div>
						   )}/>
					{/* Authentication Page */}
					<UnauthenticatedRoute path="/authentication" render={({history}) => (
						<div>
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title">Authentication</div>}
									showMenuIconButton={false}
								/>
							</div>
							<div className="app-content">
								<Authentication history={history}/>
							</div>
						</div>
					)}/>
					{/* Login page */}
					<UnauthenticatedRoute path="/login" render={({history}) => (
						<div>
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title app-bar-icon">Login</div>}
									iconElementLeft={
										<IconButton>
											<ArrowBack/>
										</IconButton>
									}
									onLeftIconButtonTouchTap={() => (history.push('/authentication'))}
								/>
							</div>
							<div className="app-content">
								<Login history={history} onComplete={this.handleLogin}/>
							</div>
						</div>
					)}/>
					{/* Register Page */}
					<UnauthenticatedRoute path="/register" render={({history}) => (
						<div>
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title app-bar-icon">Register</div>}
									iconElementLeft={
										<IconButton>
											<ArrowBack/>
										</IconButton>
									}
									onLeftIconButtonTouchTap={() => (history.push('/authentication'))}
								/>
							</div>
							<div className="app-content">
								<Register history={history} onComplete={this.handleLogin}/>
							</div>
						</div>
					)}/>

				</div>
			</MuiThemeProvider>
		);
	}
}

export default BooksApp;