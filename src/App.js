import React from 'react';
import { Link, Route } from 'react-router-dom';
import Bookshelf, { getBookshelfCategories, getBookshelfCategoryName } from './Bookshelf';
import * as BooksAPI from './BooksAPI';
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
					<div className="search-books">
						<div className="search-books-bar">
							<Link
								to='/'
								className="close-search"
							>Close</Link>
							<div className="search-books-input-wrapper">
								{/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
								<input type="text" placeholder="Search by title or author"/>

							</div>
						</div>
						<div className="search-books-results">
							<ol className="books-grid"></ol>
						</div>
					</div>
				)}/>
			</div>
		);
	}
}

export default BooksApp;