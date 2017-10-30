import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import sortBy from 'sort-by';
import Bookshelf from './Bookshelf';
import * as BooksAPI from './BooksAPI';

class Search extends Component {
	static propTypes = {
		// Books from the Shelves
		shelvesBooks: PropTypes.array.isRequired,
		onUpdateBook: PropTypes.func.isRequired,
		onUpdateBookError: PropTypes.func,
	};

	state = {
		books: [],
		query: '',
		loading: null,
	};

	updateQuery = (query) => {

		// If query is empty or undefined
		if (!query) {
			this.setState({query: '', books: [], loading: null});
			return;
		}

		query = query.trim();
		// Update the search field as soon as the character is typed
		this.setState({query: query, loading: 'loading', books: []}, function stateUpdateComplete() {
			this.search();
		}.bind(this));

	};

	/**
	 * @description Search books for this query.
	 * 	NOTES: The search from BooksAPI is limited to a particular set of search terms.
	 * 	You can find these search terms here:
	 * 	https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
	 * 	However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if you
	 * 	don't find a specific author or title. Every search is limited by search terms.
	 */
	search = () => {
		// Inside catch block the context change so assign like this to reference the app context not the catch
		// context
		const app = this;
		const query = this.state.query;

		BooksAPI.search(query).then((books) => {

			// If the query state (the search input) changed while the request was in process not show the books
			// of a previous query state
			if(query !== this.state.query) return;

			//If the query is empty no need to request to server just clean the books array
			if ('error' in books) {
				books = []
			}
			else {
				/*
				 * Since the search API didn't return the shelf property for a book this will compare with
				 * memory mapped books from the shelves to include the correct shelf attribute.
				 */
				books.map(book => (this.props.shelvesBooks.filter((b) => b.id === book.id).map(b => book.shelf = b.shelf)));
			}
			this.setState({
				books: books.sort(sortBy('title')),
				loading: null,
			});
		}).catch(function() {
			// If will remove load animations in case of failure also
			app.setState(state => ({
				books: [],
				loading: 'error',
			}));
		});
	};

	render() {
		const {onUpdateBook, onUpdateBookError} = this.props;

		const loading = (this.props.loading === 'update_book_error'? this.props.loading: this.state.loading);

		return (
			<div className="search-books">
				<div className="search-books-bar">
					<Link
						to='/'
						className="close-search"
					>Close</Link>
					<div className="search-books-input-wrapper">
						<input
							className='search-books'
							type='text'
							placeholder="Search by title or author"
							onChange={(event) => this.updateQuery(event.target.value)}
						/>
					</div>
				</div>
				<div className="search-books-results">
					<Bookshelf
						title='Search Results'
						books={this.state.books}
						onUpdateBook={onUpdateBook}
						withRibbon={true}
						withShelfMenu={false}
						loading={loading}
						onUpdateBookError={onUpdateBookError}
						onConnectionError={this.search}
					/>
				</div>
			</div>
		);
	};
}

export default Search;