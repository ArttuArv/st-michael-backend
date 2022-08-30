const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const totalAmount = (blogs) => {
  return blogs.length
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    if (favorite.likes < blog.likes) {
      return blog
    } else {
      return favorite
    }
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  const authors = lodash.groupBy(blogs, 'author')
  const mostBlogs = Object.keys(authors).map(author => {
    return { author: author, blogs: authors[author].length }
  }).reduce((most, author) => {
    if (most.blogs < author.blogs) {
      return author
    } else {
      return most
    }
  })
  return mostBlogs
}

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs, 'author')
  const mostLikes = Object.keys(authors).map(author => {
    return { author: author, likes: authors[author].reduce((total, blog) => total + blog.likes, 0) }
  }).reduce((most, author) => {
    if (most.likes < author.likes) {
      return author
    } else {
      return most
    }
  })
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  totalAmount,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}