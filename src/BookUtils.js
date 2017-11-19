import Bigi from 'bigi';
import Wif from 'wif';
import Buffer from 'safe-buffer';
import Hash from 'create-hash';
import Ecurve from 'ecurve';
import Bs58check from 'bs58check';

const secp256k1 = Ecurve.getCurveByName('secp256k1');

/**
 * @description Encode hash in base58 format.
 * @param {string} hash - The hash to be converted to base58.
 * @returns {string} Base58 encoded hash.
 */
const toBase58Check = (hash) => {
	const payload = Buffer.Buffer.allocUnsafe(21);
	payload.writeUInt8(0x00, 0);
	hash.copy(payload, 1);
	return Bs58check.encode(payload);
};

/**
 * @description Get the address account. This address use same bitcoin.
 * @param {string} wif - Private key in WIF format
 * @returns {string} Returns the address.
 */
export const getAddress = (wif) => {
	const key = secp256k1.G.multiply(Bigi.fromBuffer(Wif.decode(wif).privateKey)).getEncoded(true);
	return toBase58Check(Hash('rmd160').update(Hash('sha256').update(key).digest()).digest());
};

/**
 * @description Get a private key in WIF format.
 * @param {string} value - The value to be used into the hash that generate the key.
 * @returns {string} The key in WIF format.
 */
export const getWif = (value) => {
	const hash = Hash('sha256').update(value).digest();
	return Wif.encode(128, hash, true);
};


/**
 * @description Return true if user is logged.
 * @returns {boolean} Indicates whether client is logged.
 */
export const isLogged = () => {
	const address = localStorage.account_address;
	return !!(address);
};

/**
 * @description Save the address to local storage. This account address is used as a unique token for storing the user
 * bookshelf data on the backend server.
 * @param {string} accountAddress - The account address.
 */
export const saveAccountAddress = (accountAddress) => {
	localStorage.account_address = accountAddress;
};

/**
 * @description Remove account address from the local storage.
 */
export const cleanAccountAddress = () => {
	localStorage.removeItem('account_address');
};

/**
 * @description Get the request headers with the account address inside.
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
 *  The index matches the BOOKSHELF_CATEGORY_IDS.
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
	'/myreads/icons/shelves/currently-reading.svg',
	'/myreads/icons/shelves/want-to-read.svg',
	'/myreads/icons/shelves/read.svg',
];


/**
 * @description Get the array of all available bookshelf categories IDs.
 */
export const getBookshelfCategories = () => BOOKSHELF_CATEGORY_IDS;

/**
 * @description Return the bookshelf category name of the informed id or '' if the id doesn't belong to any category.
 * @param {string} categoryId - The id of the category.
 * @returns {string} The category name.
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
 * @description Return the bookshelf category svg icon reference of the informed id or '' if the id doesn't belong to
 * any category.
 * @param {string} categoryId - The id of the category.
 * @returns {string} The path to the svg image
 */
export const getBookshelfCategoryIcon = (categoryId) => {
	const categoryInternalIndex = BOOKSHELF_CATEGORY_IDS.indexOf(categoryId);

	if (categoryInternalIndex === -1) {
		// If Category doesn't exists returns ''
		return '';
	}

	return BOOKSHELF_CATEGORY_ICONS[categoryInternalIndex];
};