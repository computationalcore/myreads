import React from 'react';
import { Link, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import sortBy from 'sort-by';
import Bookshelf, { getBookshelfCategories } from './Bookshelf';
import * as BooksAPI from './BooksAPI';
import Search from './Search';
import './App.css';

class BooksApp extends React.Component {

	state = {
		books: [],
		loading: 'loading',
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

	render() {
		return (
			<MuiThemeProvider>
				<div className="app">
					<Route exact path='/' render={() => (
						<div className="list-books">
							<AppBar
								title="MyReads"
								iconClassNameRight="muidocs-icon-navigation-expand-more"
							/>
							<div className="list-books-content">
								<div>
									{getBookshelfCategories().map((shelf) => (
										<div key={shelf} className="bookshelf">
											<br />
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
							loading={this.state.loading}
							onUpdateBookError={this.handleUpdateBookError}
						/>
					)}/>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default BooksApp;