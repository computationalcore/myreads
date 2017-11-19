# MyReads Project

This repository contains my implementation of the MyReads app. This is the final assessment project for the
Udacity's React Fundamentals course (part of the React Nanodegree Program). 

MyReads is a bookshelf app that allows the user to select and categorize books they have read, are currently reading, or
want to read.

![](https://raw.githubusercontent.com/computationalcore/myreads/gh-pages/myreads.gif)

## Demo

[computationalcore.github.io/myreads](https://computationalcore.github.io/myreads)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing 
purposes. 

### Prerequisites

The project can be built with npm or yarn, so choose one of the approach bellow in case you don't 
have any installed on your system. 

* npm is distributed with Node.js which means that when you download Node.js, 
you automatically get npm installed on your computer. [Download Node.js](https://github.com/facebookincubator/create-react-app)

or

* Yarn is a package manager built by Facebook Team and seems to be faster than npm in general.  [Download Yarn](https://yarnpkg.com/en/docs/install)

### Installing

To download the project follow the instructions bellow

```
git clone https://github.com/computationalcore/myreads
cd myreads
```

Install dependencies and run with:
 
npm
```
npm install
npm start
```
or

yarn
```
yarn install
yarn start
```

## Backend Server

To simplify development process, Udacity provides a backend server for you to develop against. 
The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations 
on the backend:

* [`getAll`](#getall)
* [`update`](#update)
* [`search`](#search)

### `getAll`

Method Signature:

```js
getAll()
```

* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update`

Method Signature:

```js
update(book, shelf)
```

* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search`

Method Signature:

```js
search(query, maxResults)
```

* query: `<String>`
* maxResults: `<Integer>` Due to the nature of the backend server, search results are capped at 20, even if this is set higher.
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.

### Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can 
be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend,
so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

## To the Infinity and beyond

All the features added beyond the basic project specs were developed with the intention to extract as much as I 
could from the lectures so far and as much as I could from the API data, without the need to extend any other server-side 
functionality. For example, bookmark books functionality would require to implement a backend API call to save this data
for the account/token, so I considered it out of the scope, focusing only on react related features and its interactions
with the provided API. Also note that the authentication architecture is based on similar concepts used in
bitcoin paper wallets, using a bitcoin address as the token the server side expect on the requests, and the private key
that generates this address as the only credential needed to login into the system. 

![](https://raw.githubusercontent.com/computationalcore/myreads/gh-pages/myreads_authentication.gif)

## Versions

v1.0 
* Default project implementation 
 
v1.1 
* Change to material UI based interface
* Book transitions animations
* Shelf category ribbon on each book at search page
* Bulk move books
* Clear shelf capabilities

v1.2
* Connection error handlers
* Star ratings on each book
* Individual book info page 

v1.3
* Authenticated account support
* Book sharing functionality 
* Book search functionality for each bookshelf

## Authors
Vin Busquet
* [https://github.com/computationalcore](https://github.com/computationalcore)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


## Acknowledgments
* [Udacity](https://www.udacity.com/)
* [Tyler McGinnis](https://twitter.com/tylermcginnis33)
* [Ryan Florence](https://twitter.com/ryanflorence)
* [Michael Jackson](https://twitter.com/mjackson)
* [Alfredo Hernandez](https://alfredocreates.com)
