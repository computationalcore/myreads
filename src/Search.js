import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf';
import * as BookUtils from './BookUtils';

class Search extends Component {
	static propTypes = {
		// Books from the Shelves
		books: PropTypes.array.isRequired,
		query: PropTypes.string.isRequired,
		request: PropTypes.oneOf(Object.values(BookUtils.request)),
		onSearch: PropTypes.func.isRequired,
		onUpdateQuery: PropTypes.func.isRequired,
		onUpdateBook: PropTypes.func.isRequired,
		onUpdateBookError: PropTypes.func,
	};

	render() {
		const {books, request, query, onUpdateQuery, onSearch, onUpdateBook, onUpdateBookError} = this.props;

		return (
			<div className="search-books">
				<div className="search-books-bar">
					<div className="search-books-input-wrapper">
						<input
							value={query}
							className='search-books'
							type='text'
							placeholder="Search by title or author"
							onChange={(event) => onUpdateQuery(event.target.value)}
						/>
					</div>
				</div>
				<div className="search-books-results">
					<Bookshelf
						title='Search Results'
						books={books}
						onUpdateBook={onUpdateBook}
						withRibbon={true}
						withShelfMenu={false}
						request={request}
						onUpdateBookError={onUpdateBookError}
						onConnectionError={onSearch}
					/>
				</div>
			</div>
		);
	};
}

export default Search;