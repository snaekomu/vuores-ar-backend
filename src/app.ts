//Definitions
import {Request, Response, NextFunction} from "express"

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const postcssMiddleware = require('postcss-middleware')

// Routers
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const apiRouter = require('./routes/api')

const app = express()

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Middleware
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public/web')))
app.use('/static', express.static(path.join(__dirname, 'public/ar')))

// Use routers
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api', apiRouter)

// PostCSS
app.use('/css', postcssMiddleware({
  src (req: Request) {
    return path.join(__dirname, 'public', 'stylesheets', req.url)
  },
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env'),
  ],
}))

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})

// error handler
app.use((err: Error & {status?: number}, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
