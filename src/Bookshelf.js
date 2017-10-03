import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Bookshelf extends Component {

	static propTypes = {
		// List of books
		books: PropTypes.array.isRequired,
		availableShelves: PropTypes.array.isRequired,
		onUpdateBook: PropTypes.func.isRequired
	};

	render() {
		const {books, onBookUpdate, availableShelves} = this.props;

		return (
			<ol className="books-grid">
				{books.map((book) => (
					<li key={book.id}>
						<div className="book">
							<div className="book-top">
								<div className="book-cover" style={{
									width: 128,
									height: 193,
									backgroundImage: `url(${book.imageLinks.thumbnail})`
								}}>
								</div>
								<div className="book-shelf-changer">
									<select
										onChange={(event) => onBookUpdate(book, event.target.value)}
										value={book.shelf}>
										<option disabled>Move to...</option>
										{availableShelves.map((shelf) => (
											<option key={shelf.id} value={shelf.id}>{shelf.name}</option>
										))}
										<option value="none">None</option>
									</select>
								</div>
							</div>
							<div className="book-title">{book.title}</div>
							<div className="book-authors">{book.authors.join(', ')}</div>
						</div>
					</li>
				))}
			</ol>
		);
	}
}

export default Bookshelf;