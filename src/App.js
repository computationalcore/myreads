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
import Bookshelf from './Bookshelf';
import Authentication from './Authentication';
import BookInfo from './BookInfo';
import Login from './Login';
import Register from './Register';
import Search from './Search';
import PrivateRoute from './PrivateRoute';
import UnauthenticatedRoute from './UnauthenticatedRoute';
import './App.css';

/**
 * Main App component.
 */
class BooksApp extends React.Component {

	state = {
		books: [],
		request: BookUtils.request.OK, /* Represents the app request state used for API requests */
		menuOpen: false,
		// Search related state
		searchResults: [],
		query: '',
	};

	logout = (history) => {
		BookUtils.cleanAccountAddress();
		history.push('/authentication');
	};

	/**
	 * Lifecycle event handler called just after the App loads into the DOM.
	 * Call the API to get all books and update books state variable when the callback returns.
	 */
	componentDidMount() {
		// Execute get books only if user is logged
		if(BookUtils.isLogged()) {
			this.getAllBooks();
		}
	}

	/**
	 * Save account address into local storage and proceed to main app page.
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
	 * @description Change shelf value for a book element from the server data
	 * @param {object) book
	 * @param {string} shelf
	 */
	updateBook = (book, shelf) => {
		// If books state array is not empty
		if (this.state.books) {

			// Update book state to include updating variable used at book updating animation
			book.updating = true;
			this.setState(state => ({
				books: state.books.filter(b => b.id !== book.id).concat([book])
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
					books: state.books.filter(b => b.id !== book.id).concat([book])
				}));
			}).catch(function () {
				// If will remove load animations in case of failure also
				book.updating = false;
				app.setState(state => ({
					books: state.books.filter(b => b.id !== book.id).concat([book]),
					request: BookUtils.request.BOOK_ERROR,
				}));
			});
		}
	};

	/**
	 * @description Change request state to OK in case of pressing OK at dialog after an individual book update failure
	 */
	handleUpdateBookError = () => {
		this.setState({request: BookUtils.request.OK});
	};

	handleMenuToggle = () => {
		this.setState(state => ({
			menuOpen: !state.menuOpen,
		}));
	};

	goToShelf = (shelf) => {
		this.setState({menuOpen: false}, function stateUpdateComplete() {
			scrollToComponent(this[shelf], {offset: -90, align: 'top', duration: 500, ease: 'inCirc'});
		}.bind(this));


	};

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
	 * @description Search books for this query.
	 *    NOTES: The search from BooksAPI is limited to a particular set of search terms.
	 *    You can find these search terms here:
	 *    https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
	 *    However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if you
	 *    don't find a specific author or title. Every search is limited by search terms.
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
	 *
	 */
	goToPrevious = (history) => {
		history.push("/");
		// Clear previous search if go back to home
		this.setState({query: '', searchResults: []});
	};

	render() {
		return (
			<MuiThemeProvider>
				<div className="app">
					{/* Main app screen - Logged Route */}
					<PrivateRoute exact path='/' render={({history}) => (
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
									<Divider />
									<MenuItem onClick={() => (this.logout(history))}>
										<Logout className="app-menu-shelf-icon" style={{color: 'grey'}} />
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
												books={this.state.books.filter((book) => book.shelf === shelf).sort(sortBy('title'))}
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
									to='/search'
									className='add-books'
								>
									<FloatingActionButton>
										<ContentAdd/>
									</FloatingActionButton>
								</Link>
							</div>
						</div>
					)}/>
					{/* Search - Logged Route */}
					<PrivateRoute path='/search' render={({history}) => (
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
						   component={({history, match: {params: {bookId}}, location: {state}}) => (
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
									   <BookInfo bookId={bookId}/>
								   </div>
							   </div>
						   )}/>
					{/* Authentication Page */}
					<UnauthenticatedRoute path='/authentication' render={({history}) => (
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
					<UnauthenticatedRoute path='/login' render={({history}) => (
						<div>
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title app-bar-icon">Login</div>}
									iconElementLeft={
										<IconButton>
											<ArrowBack/>
										</IconButton>
									}
									onLeftIconButtonTouchTap={() => (history.push("/authentication"))}
								/>
							</div>
							<div className="app-content">
								<Login history={history} onComplete={this.handleLogin} />
							</div>
						</div>
					)}/>
					{/* Register Page */}
					<UnauthenticatedRoute path='/register' render={({history}) => (
						<div>
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title app-bar-icon">Register</div>}
									iconElementLeft={
										<IconButton>
											<ArrowBack/>
										</IconButton>
									}
									onLeftIconButtonTouchTap={() => (history.push("/authentication"))}
								/>
							</div>
							<div className="app-content">
								<Register history={history} onComplete={this.handleLogin} />
							</div>
						</div>
					)}/>

				</div>
			</MuiThemeProvider>
		);
	}
}

export default BooksApp;