import React from 'react';
import { Link, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import sortBy from 'sort-by';
import Bookshelf from './Bookshelf';
import * as BooksAPI from './BooksAPI';
import * as BookUtils from './BookUtils';
import Search from './Search';
import './App.css';


import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import scrollToComponent from 'react-scroll-to-component';


class BooksApp extends React.Component {

	state = {
		books: [],
		loading: 'loading',
		menuOpen: false
	};

	/**
	 * Lifecycle event handler called just after the App loads into the DOM.
	 * Call the API to get all books and update books state variable when the callback returns.
	 */
	componentDidMount() {
		this.getAllBooks();
	}

	getAllBooks = ()  => {
		// Inside catch block the context change so assign like this to reference the app context not the catch
		// context
		const app = this;
		this.setState({loading: 'loading'});
		// Update the Shelves
		BooksAPI.getAll().then((books) => {
			app.setState({books: books, loading:null});
		}).catch(function() {
			app.setState({loading: 'error'});
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

			// Update book state to include loading variable used at updating animation
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
			}).catch(function() {
				// If will remove load animations in case of failure also
				book.updating = false;
				app.setState(state => ({
					books: state.books.filter(b => b.id !== book.id).concat([book]),
					loading: 'update_book_error',
				}));
			});
		}
	};

	/**
	 * @description Change loading state to null in case of failure
	 */
	handleUpdateBookError = () => {
		this.setState({loading: null});
	};

	handleMenuToggle = () => {
		this.setState(state => ({
			menuOpen: !state.menuOpen,
		}));
	};

	goToShelf = (shelf) => {
		this.setState({menuOpen: false}, function stateUpdateComplete() {
			scrollToComponent(this[shelf], { offset: -90, align: 'top', duration: 500, ease:'inCirc'});
		}.bind(this));


	};

	render() {
		return (
			<MuiThemeProvider>
				<div className="app">
					<Route exact path='/' render={() => (
						<div className="list-books">
							<div className="app-bar">
								<AppBar
									title={<div className="app-bar-title">MyReads</div>}
									iconClassNameRight="muidocs-icon-navigation-expand-more"
									onLeftIconButtonTouchTap={this.handleMenuToggle}
								/>
							</div>
							<Drawer open={this.state.menuOpen} docked={false}>
								{BookUtils.getBookshelfCategories().map((shelf) => (
									<MenuItem key={shelf} onClick={() => this.goToShelf(shelf)}>
										<img className="app-menu-shelf-icon"
											 src={BookUtils.getBookshelfCategoryIcon(shelf)}
											 alt={this.props.category} />
										<span>{BookUtils.getBookshelfCategoryName(shelf)}</span>
									</MenuItem>
								))}
							</Drawer>

							<div className="list-books-content">
								<div>
									{BookUtils.getBookshelfCategories().map((shelf) => (
										<div key={shelf} className="bookshelf"
											 ref={(section) => { this[shelf] = section; }}>
											<Bookshelf
												books={this.state.books.filter((book) => book.shelf === shelf).sort(sortBy('title'))}
												category={shelf}
												loading={this.state.loading}
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
										<ContentAdd />
									</FloatingActionButton>
								</Link>

							</div>
						</div>
					)}/>
					<Route path='/search' render={({history}) => (
						<Search
							shelvesBooks={this.state.books}
							onUpdateBook={this.updateBook}
							loading
							onUpdateBookError={this.handleUpdateBookError}
						/>
					)}/>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default BooksApp;