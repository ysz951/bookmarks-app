import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import BookmarksContext from './BookmarksContext';
import EditBookmark from './EditBookmark/EditBookmark';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bm =>
      bm.id !== bookmarkId
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }

  updateBookmark = bookmark => {
    const newBookmarks = [...this.state.bookmarks]
    const i = newBookmarks.findIndex(book => book.id === bookmark.id)
    newBookmarks[i] = bookmark
    this.setState({
      bookmarks: newBookmarks
    })
  }
  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(message => {
            throw new Error(message)
          });
          // return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(bookmarks => {
        this.setBookmarks(bookmarks)})
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route
              path='/add-bookmark'
              component={AddBookmark}
            />
            <Route
              exact
              path='/'
              component={BookmarkList}
            />
            <Route
              path='/edit/:bookmarkId'
              render={(routerProps) => 
              <EditBookmark 
                bookmarkId = {routerProps.match.params.bookmarkId} 
                history={routerProps.history}
              />}
            />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
