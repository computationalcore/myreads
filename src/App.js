import React from 'react';
import { Link, Route } from 'react-router-dom';
import Bookshelf, { getBookshelfCategories, getBookshelfCategoryName } from './Bookshelf';
import * as BooksAPI from './BooksAPI';
import Search from './Search';
import './App.css';

class BooksApp extends React.Component {

	state = {books: []};

	/**
	 * Lifecycle event handler called just after the App loads into the DOM.
	 * Call the API to get all books and update books state variable when the callback returns.
	 */
	componentDidMount() {
		// Update the Shelves
		BooksAPI.getAll().then((books) => {
			this.setState({books: books});
		});
	}

	updateBook = (book, shelf) => {
		// If books state is not empty
		if (this.state.books) {
			// Update book reference at remote server, if successful update local state reference also
			BooksAPI.update(book, shelf).then(() => {
				book.shelf = shelf;
				// This will update all Bookshelf components since it will force call render and the book will move
				// to the correct shelf.
				this.setState(state => ({
					books: state.books.filter(b => b.id !== book.id).concat([book])
				}));
			});
		}
	};

	render() {
		return (
			<div className="app">
				<Route exact path='/' render={() => (
					<div className="list-books">
						<div className="list-books-title">
							<h1>MyReads</h1>
						</div>
						<div className="list-books-content">
							<div>
								{getBookshelfCategories().map((shelf) => (
									<div key={shelf} className="bookshelf">
										<h2 className="bookshelf-title">{getBookshelfCategoryName(shelf)}</h2>
										<Bookshelf
											books={this.state.books.filter((book) => book.shelf === shelf)}
											category={shelf}
											onUpdateBook={this.updateBook}
										/>
									</div>
								))}
							</div>
						</div>
						<div className="open-search">
							<Link
								to='/search'
								className='add-books'
							>Add a book</Link>
						</div>
					</div>
				)}/>
				<Route path='/search' render={({history}) => (
					<Search
						shelvesBooks={this.state.books}
						onUpdateBook={this.updateBook}
					/>
				)}/>
			</div>
		);
	}
}

export default BooksApp;