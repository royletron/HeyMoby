var Collection = require('../models/Collection');
var _ = require('underscore');

/**
 * GET /collections/add
 * Collection add.
 */

exports.add = function(req, res, next) {
	Collection.findOne({slug: req.params.slug}, function(err, collection){
		if(err)	return next(err);

		res.render('item/new', {
			collection: collection,
			title: 'Add Item'
		})
	})
};

exports.create = function(req, res, next){
	Collection.findOne({slug: req.params.slug}, function(err, collection){
		if(err) return next(err);
		
		console.log(req.body);

		var item = {
			name: req.body.name,
			images: [],
			sounds: [],
			user: req.user.id,
			item_collection: collection._id
		}

		_.each(req.body.sounds, function(sound, idx){
			if(sound != '')
				item.sounds.push({url: sound, user: req.user.id})
		});

		_.each(req.body.images, function(image, idx){
			if(image != '')
				item.images.push({url: image, user: req.user.id});
		})

		collection.items.push(item);

		console.log(collection);

		collection.save(function(err){
			if(err) return next(err);
      req.flash('success', { msg: 'Success! '+item.name+' created.' });
			res.redirect('/collection/'+collection.slug);
		})
	});
}