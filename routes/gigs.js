const router = require('express').Router()
const Op = require('sequelize').Op
const Gig = require('../models/Gig')

// Get gig list
router.get('/', async (req, res) => {
	try {
		const gigs = await Gig.findAll()
		res.render('gigs', {
			gigs,
		})
	} catch (err) {
		console.log(err)
	}
})

// Display add gig form
router.get('/add', (req, res) => {
	res.render('add')
})

// Add a gig
router.post('/add', async (req, res) => {
	try {
		let { title, technologies, budget, contact_email, description } = req.body
		let errors = []

		// Validate Fields
		if (!title) {
			errors.push({ text: 'Please add a title' })
		}

		if (!technologies) {
			errors.push({ text: 'Please add some technologies' })
		}

		if (!description) {
			errors.push({ text: 'Please add a description' })
		}

		if (!contact_email) {
			errors.push({ text: 'Please add a contact email' })
		}

		if (errors.length > 0) {
			console.log(title, technologies, budget, contact_email, description)
			res.render('add', {
				errors,
				title,
				technologies,
				budget,
				description,
				contact_email,
			})
		} else {
			if (!budget) {
				budget = 'Unknow'
			} else {
				budget = `$${budget}`
			}

			technologies = technologies.toLowerCase().replace(/, /g, ',')

			await Gig.create({
				title,
				technologies,
				description,
				budget,
				contact_email,
			})

			res.redirect('/gigs')
		}
	} catch (err) {
		console.log(err)
	}
})

// Search for gigs
router.get('/search', async (req, res) => {
	try {
		let { term } = req.query
		term = term.toLowerCase()
		const gigs = await Gig.findAll({
			where: { technologies: { [Op.like]: '%' + term + '%' } },
		})

		res.render('gigs', { gigs })
	} catch (err) {
		console.log(err)
	}
})

module.exports = router
