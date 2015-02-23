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
			var t = _.groupBy(s, function(item){ return item.name.charAt(0).toLowerCase(); });
			res.render('collection/show', {
				title: collection.name,
				collection: collection,
				grouped: t,
				colors: {z: 'green accent-1', w: 'orange lighten-5', c: 'brown lighten-5', y: 'amber lighten-5', e: 'cyan lighten-5', f: 'pink lighten-5', g: 'deep-orange lighten-5', h: 'blue-grey lighten-5', i: 'purple lighten-5', j: 'blue lighten-5', k: 'teal lighten-5', l: 'lime lighten-5', m: 'yellow lighten-5', n: 'grey lighten-5', o: 'red lighten-5', p: ' deep-purple lighten-5', q: 'indigo lighten-5', r: 'light-blue lighten-5', s: 'light-green lighten-5', t: 'green accent-1', u: 'teal accent-1', v: 'deep-orange accent-1', b: 'amber accent-1', x: 'yellow accent-1', d: 'lime accent-1', a: 'cyan accent-1'}
			})
		}
	})
}

exports.play = function(req, res, next) {
	Collection.findOne({slug: req.params.slug}).populate('user').exec(function(err, collection){
		if(collection == null){
			res.status(400);
		}
		else
		{
			var s = _.sortBy(collection.items, function(item){ return item.name });
			var t = _.groupBy(s, function(item){ return item.name.charAt(0).toLowerCase(); });
			res.render('collection/play', {
				title: 'Play '+collection.name,
				grouped: t
			})
		}
	})
}