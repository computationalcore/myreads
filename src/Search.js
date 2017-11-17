import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf';
import * as BookUtils from './BookUtils';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	// Books from the Shelves
	books: PropTypes.array.isRequired,
	query: PropTypes.string.isRequired,
	request: PropTypes.oneOf(Object.values(BookUtils.request)),
	onSearch: PropTypes.func.isRequired,
	onUpdateQuery: PropTypes.func.isRequired,
	onUpdateBook: PropTypes.func.isRequired,
	onUpdateBookError: PropTypes.func,
};

/**
 * @description	The Search page component.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 */
class Search extends Component {

	/**
	 * Lifecycle event handler called just after the App loads into the DOM.
	 * Focus the search input when component load.
	 */
	componentDidMount(){
		this.searchInput.focus();
	}

	render() {
		const {books, request, query, onUpdateQuery, onSearch, onUpdateBook, onUpdateBookError} = this.props;

		return (
			<div className="search-books">
				<div className="search-books-bar">
					<div className="search-books-input-wrapper">
						<input
							ref={(input) => {
								this.searchInput = input;
							}}
							value={query}
							className="search-books"
							type="text"
							placeholder="Search by title or author"
							onChange={(event) => onUpdateQuery(event.target.value)}
						/>
					</div>
				</div>
				<div className="search-books-results">
					<div className="search-books-results-internal">
						<p className="important-note search-note">
							Important: The backend API uses a fixed set of cached search results and is limited to a
							particular set of search terms, which can be found in&nbsp;
							<a target="_blank"
							   href="https://github.com/computationalcore/myreads/blob/master/SEARCH_TERMS.md"
							>
								SEARCH_TERMS.md
							</a>.
						</p>
						<Bookshelf
							title="Search Results"
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
			</div>
		);
	};
}

// Type checking the props of the component
Search.propTypes = propTypes;

export default Search;