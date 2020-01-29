const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

// Database
const db = require('./config/database')

// Connect Test Database
db.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.')
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err)
	})

// Express App
const PORT = process.env.PORT || 5000
const app = express()

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', (req, res) => res.render('index', { layout: 'landing' }))
app.use('/gigs', require('./routes/gigs'))

// Start App
app.listen(PORT, console.log(`Server started on port ${PORT}`))
