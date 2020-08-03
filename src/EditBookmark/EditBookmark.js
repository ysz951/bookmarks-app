import React, { Component } from  'react';
import PropTypes from 'prop-types';
import config from '../config';
import BookmarksContext from '../BookmarksContext';

const Required = () => (
    <span className='AddBookmark__required'>*</span>
)
class EditBookmark extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };
  state = {
    id: null,
    title: "",
    url: "",
    description: null,
    rating: "",
    error: null,
  };

  static contextType = BookmarksContext;
  componentDidMount() {
    const bookmarkLink = `${config.API_ENDPOINT}/${this.props.bookmarkId}`
    this.setState({ error: null })
    fetch(bookmarkLink, {
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
      .then(res => {
        this.setState({...res})
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }


  handleClickCancel = () => {
    this.props.history.push('/')
  };
  handleSubmit = e => {
    e.preventDefault()
    const bookmarkLink = `${config.API_ENDPOINT}/${this.props.bookmarkId}`
    const { title, url, description, rating } = e.target
    const bookmark = {
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value,
    }
    const newBookmark = {
      id: Number(this.props.bookmarkId),
      title: title.value,
      url: url.value,
      description: description.value,
      rating: Number(rating.value),
    }
    this.setState({ error: null })
    fetch(bookmarkLink, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(message => {
            throw new Error(message)
          });
          // return res.json().then(error => Promise.reject(error))
        }
      })
      .then(data => {
        // console.log(data)
        title.value = ''
        url.value = ''
        description.value = ''
        rating.value = ''
        // console.log(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }
  render() {
    const { id, title, url, description, rating, error } = this.state
    // console.log(this.context.addBookmark)
    return (
      <section className='EditArticleForm'>
        <h2>Edit bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              defaultValue = {title}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              defaultValue = {url}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            {id ? (<textarea
              name='description'
              id='description'
              defaultValue = {description}
            />) : null}
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue={rating.toString()}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Update
            </button>
          </div>
        </form>
      </section>
    )
  }
}

export default EditBookmark;