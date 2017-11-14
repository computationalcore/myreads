import CurrentlyReading from './icons/shelves/currently-reading.svg';
import WantToRead from './icons/shelves/want-to-read.svg';
import Read from './icons/shelves/read.svg';

// Generate a unique token for storing your bookshelf data on the backend server.

/**
 * Return true if user is logged
 * @returns {boolean}
 */
export const isLogged = () => {
	const address = localStorage.account_address;
	return !!(address);
};

/**
 * Save the address to local storage. This account address is used as a unique token for storing the user bookshelf
 * data on the backend server.
 * @param accountAddress
 */
export const saveAccountAddress = (accountAddress) => {
	localStorage.account_address = accountAddress;
};

/**
 * Remove account address from the local storage.
 */
export const cleanAccountAddress = () => {
	localStorage.removeItem('account_address');
};

/**
 * Get the request headers with the account address inside
 */
export const getAccountHeaders = () => (
	{
		'Accept': 'application/json',
		'Authorization': localStorage.account_address
	}
);


/**
 *
 * @type {{OK: number, LOADING: number, ERROR: number, BOOK_ERROR: number}}
 */
export const request = {
	'OK': 1,
	'LOADING': 2,
	'ERROR': 3,
	'BOOK_ERROR': 4,
};

// Category Utils functions

/**
 * Array of the available bookshelf categories IDs.
 * @type {[string,string,string]}
 */
const BOOKSHELF_CATEGORY_IDS = [
	'currentlyReading',
	'wantToRead',
	'read',
];

/**
 *  Array of the available bookshelf categories names.
 *  The index matches the BOOKSHELF_CATEGORY_IDS
 * @type {[string,string,string]}
 */
const BOOKSHELF_CATEGORY_NAMES = [
	'Currently Reading',
	'Want to Read',
	'Read',
];

/**
 * Array of svg icons for each bookshelf categories.
 * @type {[object,object,object]}
 */
const BOOKSHELF_CATEGORY_ICONS = [
	CurrentlyReading,
	WantToRead,
	Read,
];


/**
 * Get the array of all available bookshelf categories IDs
 */
export const getBookshelfCategories = () => BOOKSHELF_CATEGORY_IDS;

/**
 * Return the bookshelf category name of the informed id or '' if the id doesn't belong to any category.
 * @param categoryId
 * @returns string
 */
export const getBookshelfCategoryName = (categoryId) => {
	const categoryInternalIndex = BOOKSHELF_CATEGORY_IDS.indexOf(categoryId);

	if (categoryInternalIndex === -1) {
		// If Category doesn't exists returns ''
		return '';
	}

	return BOOKSHELF_CATEGORY_NAMES[categoryInternalIndex];
};

/**
 * Return the bookshelf category svg icon reference of the informed id or '' if the id doesn't belong to any category.
 * @param categoryId
 * @returns object
 */
export const getBookshelfCategoryIcon = (categoryId) => {
	const categoryInternalIndex = BOOKSHELF_CATEGORY_IDS.indexOf(categoryId);

	if (categoryInternalIndex === -1) {
		// If Category doesn't exists returns ''
		return '';
	}

	return BOOKSHELF_CATEGORY_ICONS[categoryInternalIndex];
};