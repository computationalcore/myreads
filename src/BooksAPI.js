import * as BookUtils from './BookUtils';

const api = "https://reactnd-books-api.udacity.com";

// Generate a unique token for retrieving get one book API call since it doesn't need the any user related data
// a not logged user could access it.
let token = localStorage.token;
if (!token)
	token = Math.random().toString(36).substr(-8);

const headers = {
	'Accept': 'application/json',
	'Authorization': token
};

console.log(BookUtils.getAccountHeaders());

export const get = (bookId) =>
	fetch(`${api}/books/${bookId}`, {headers})
		.then(res => {
			if (res.status !== 200){
				return res;
			}
			return res.json();
		})
		.then(data => {
			// Only happen if status is 200
			if(data.book){
				return data.book;
			}
			// Return the object with with http status (error code)
			const error = {errorCode: data.status};
			return error;
		});

export const getAll = () => {
	const headers = BookUtils.getAccountHeaders();
	return fetch(`${api}/books`, {headers})
		.then(res => res.json())
		.then(data => data.books);
};

export const update = (book, shelf) =>
	fetch(`${api}/books/${book.id}`, {
		method: 'PUT',
		headers: {
			...BookUtils.getAccountHeaders(),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({shelf})
	}).then(res => res.json());

export const search = (query, maxResults) =>
	fetch(`${api}/search`, {
		method: 'POST',
		headers: {
			...BookUtils.getAccountHeaders(),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({query, maxResults})
	}).then(res => res.json())
		.then(data => data.books);
