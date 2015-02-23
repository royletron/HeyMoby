var _ = require('underscore');
var Collection = require('../models/Collection');

/**
 * GET /collections
 * Collection index.
 */
exports.index = function(req, res, next) {
	Collection.find({}, function(err, collections){
		if(err) return next(err);
	  res.render('collection/index', {
	  	collections: collections,
	    title: 'Collections'
	  });
	});
};

/**
 * GET /collections/add
 * Collection add.
 */

exports.add = function(req, res) {
	res.render('collection/new', {
		title: 'Add Collection'
	})
};

/**
 * POST /collections/add
 * Collection add post method.
 */
exports.create = function(req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/collections/add');
  }

  var collection = new Collection({
  	name: req.body.name,
  	description: req.body.description,
  	user: req.user.id
  })
  collection.save(function(err){
  	if(err) return next(err);
    req.flash('success', { msg: 'Success! '+collection.name+' created.' });
  	res.redirect('/collections/')
  })
}

/**
 * GET /collection/:slug
 * Individual collection show
 */
exports.show = function(req, res, next) {
	Collection.findOne({slug: req.params.slug}).populate('user').exec(function(err, collection){
		if(collection == null){
			res.status(400);
		}
		else
		{
			console.log(collection);
			var s = _.sortBy(collection.items, function(item){ return item.name });
			var t = _.groupBy(s, function(item){ return item.name.charAt(0); });
			res.render('collection/show', {
				title: collection.name,
				collection: collection,
				grouped: t,
				colors: {Z: 'green accent-1', W: 'orange lighten-5', C: 'brown lighten-5', Y: 'amber lighten-5', E: 'cyan lighten-5', F: 'pink lighten-5', G: 'deep-orange lighten-5', H: 'blue-grey lighten-5', I: 'purple lighten-5', J: 'blue lighten-5', K: 'teal lighten-5', L: 'lime lighten-5', M: 'yellow lighten-5', N: 'grey lighten-5', O: 'red lighten-5', P: ' deep-purple lighten-5', Q: 'indigo lighten-5', R: 'light-blue lighten-5', S: 'light-green lighten-5', T: 'green accent-1', U: 'teal accent-1', V: 'deep-orange accent-1', B: 'amber accent-1', X: 'yellow accent-1', D: 'lime accent-1', A: 'cyan accent-1'}
			})
		}
	})
}