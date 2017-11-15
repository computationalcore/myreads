import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import LoaderBox from './Loader';
import * as BooksAPI from './BooksAPI';
import BookRating from './BookRating';
import Share from './Share';

const rateItURL = 'https://books.google.com.br/books?op=lookup&id=';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	id: PropTypes.string.isRequired,
};

/**
 * @description	BookInfo page
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} props.id - The id of the book.
 */
class BookInfo extends Component {

	constructor(props){
		super(props);
		/**
		 * @typedef {Object} ComponentState
		 * @property {Object} book - The book object.
		 * @property {boolean} loading - Indicates whether the page is updating.
		 */

		/** @type {ComponentState} */
		this.state = {
			book: {},
			status: 'loading',
		};
	}

	/**
	 * Lifecycle event handler called just after the App loads into the DOM.
	 * Call the API to get all books and update books state variable when the callback returns.
	 */
	componentDidMount() {
		this.getBookInfo();
	}

	/**
	 * @description Call the API to get book data and update book state variable when the callback returns.
	 */
	getBookInfo = ()  => {
		// Inside catch block the context change so assign like this to reference the app context not the catch
		// context
		const app = this;
		this.setState({status: 'loading'});
		// Get the book data using API request
		BooksAPI.get(this.props.id).then((book) => {
			// No error, book data is available
			if(!book.errorCode) {
				app.setState({book: book, status: 'ok'});
			}
			// 500 happens when bookID is not found (it can happen for any other server internal error, but since
			// API response is limited I must assume that the 500 means no book available for the informed book ID
			else {
				if(book.errorCode === 500){
					app.setState({status: 'not_found'});
				}
				// Any other  error code
				else {
					app.setState({status: 'error'});
				}
			}
		}).catch(function() {
			app.setState({status: 'error'});
		});
	};

	render() {
		const book = this.state.book;

		return (
			<div style={{textAlign: 'center'}}>
				{/* Show when app is getting data from server */}
				<div className="shelf-loader-box">
					<LoaderBox loading={this.state.status === 'loading'} size={70} message="Loading Book Data"/>
				</div>
				{/* Show when app have problems getting book data from server */}
				{(this.state.status === 'error') &&
				<div className="shelf-message-text">
					<div>Unable to fetch data from server</div>
					<div>(Maybe internet connection or server instability)</div>
					<RaisedButton label="Try Again" primary={true} onClick={this.getBookInfo}/>
				</div>
				}
				{/* Show when book id is not found */}
				{(this.state.status === 'not_found') &&
				<div className="shelf-message-text">
					No Book available for the informed ID.
				</div>
				}
				{/* Book */}
				{(this.state.status === 'ok') &&
				<Card style={{margin: 20}}>
					<div>
						<CardTitle title={book.title} subtitle={('subtitle' in book) ? book.subtitle : ''}/>
						<div className="info-grid">
							<div className="info-item">
								<img src={book.imageLinks.thumbnail} alt="book.title"/>
								<div className="book-rating-container">
									<BookRating
										value={(book.averageRating) ? book.averageRating : 0}
										count={(book.ratingsCount) ? book.ratingsCount : 0}
									/>
								</div>
							</div>
							<div className="info-item">
								{('authors' in book) &&
								<div className="info-prop">
									<span
										className="info-prop-title">{(book.authors.length > 1) ? 'Authors' : 'Author'}
									</span>
									{book.authors.map((author) => (
										<span key={author} className="info-prop-content">
														{author}
													</span>
									))}
								</div>
								}
								{book.publisher &&
								<div className="info-prop">
									<span className="info-prop-title">Publisher</span>
									<span className="info-prop-content">{book.publisher}</span>
								</div>
								}
								{book.publishedDate &&
								<div className="info-prop">
									<span className="info-prop-title">Published Date</span>
									<span className="info-prop-content">{book.publishedDate}</span>
								</div>
								}
								{('pageCount' in book) &&
								<div className="info-prop">
									<span className="info-prop-title">Pages</span>
									<span className="info-prop-content">{book.pageCount}</span>
								</div>
								}
								{book.categories &&
								<div className="info-prop">
									<span
										className="info-prop-title">
										{(book.categories.length > 1) ? 'Categories' : 'Category'}
									</span>
									{book.categories.map((category) => (
										<span key={category} className="info-prop-content">
													{category}
												</span>
									))}
								</div>
								}
							</div>
						</div>
					</div>
					<CardText>
						{book.description}
					</CardText>
					<CardActions>
						<div>
							<RaisedButton
								className="info-action-button"
								href={rateItURL + book.id}
								target="_blank"
								label="Rate It"
								primary={true}
								icon={<ActionGrade/>}
							/>
							<RaisedButton
								className="info-action-button"
								href={book.previewLink}
								target="_blank"
								label="Preview"
								primary={true}
								icon={<RemoveRedEye/>}
							/>
						</div>
						<div className="info-share">
							<h3>Share</h3>
							<Share title={'MyReads - Sharing book details: ' + book.title} url={window.location.href}/>
						</div>
					</CardActions>
				</Card>
				}
			</div>
		);
	}
}
// Type checking the props of the component
BookInfo.propTypes = propTypes;

export default BookInfo;