import React from 'react';
import AppBar from 'material-ui/AppBar';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import BookInfo from './BookInfo';
import './App.css';

/**
 * @description BookInfo page component show the App title bar and BookInfo component into as different page.
 * The function signature is designed to be used as the 'component' prop for the Router component.
 * @param bookId	the id of the book which details to be showed at this page
 * @param state		If true it will show the back button at app bar otherwise home button
 * @returns {XML}
 * @constructor
 */
const BookInfoPage = ({ history, match: { params: {bookId} }, location: {state} }) => {

	return (
		<div>
			<div className="app-bar">
				<AppBar
					title={<div className="app-bar-title app-bar-icon">Book Details</div>}
					iconElementLeft={
						<IconButton>
							{state &&
							<ArrowBack />
							}
							{!state &&
							<SvgIcon>
								<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
							</SvgIcon>
							}
						</IconButton>
					}
					onLeftIconButtonTouchTap={
						() => {
							// Go Back
							if(state)
								history.goBack();
							// Go to Home
							else{
								history.push("/");
							}
						}
					}
				/>
			</div>
			<div className="app-content">
				<BookInfo bookId={bookId} />
			</div>
		</div>
	);
};

export default BookInfoPage;