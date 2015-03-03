var Collection = require('../models/Collection');
var async = require('async');
var _ = require('underscore');
var easyimg = require('easyimage');

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

		var item = {
			name: req.body.name,
			images: [],
			sounds: [],
			user: req.user.id,
			item_collection: collection._id
		}
		var files = req.files.files;
		if(!Array.isArray(files));
			files = [files];

		async.eachSeries(files, function(file, cb){
			console.log(file);
			if((file.mimetype == "image/png") || (file.mimetype == "image/jpg") || (file.mimetype == "image/jpeg")){
				easyimg.rescrop({
		     src:file.path, dst:'public/uploads/thumbs/'+file.name,
		     width:250, height:250,
		     x:0, y:0
			  }).then(
			    function(image) {
						item.images.push({url: "/uploads/"+file.name, thumb: '/uploads/thumbs/'+file.name, user: req.user.id});
						cb();
			    },
			    function (err) {
			      cb('Upload problem');
			    }
			  );
			}
			else{
				item.sounds.push({url: "/uploads/"+file.name, user: req.user.id})
				cb();
			}
		}, function(err){
			console.log(item);
			if(err) return next(err);
			collection.items.push(item);

			collection.save(function(err){
				if(err) return next(err);
	      req.flash('success', { msg: 'Success! '+item.name+' created.' });
				res.redirect('/collection/'+collection.slug);
			})
		});
	});
}

exports.image_add = function(req, res, next){
	Collection.findOne({slug: req.params.slug}, function(err, collection){
		if(err) return next(err);
		var file = req.files.files;
		easyimg.rescrop({
			src:file.path, dst:'public/uploads/thumbs/'+file.name,
			width:250, height:250,
			x:0, y:0
		}).then(
			function(image) {
				collection.items.id(req.params.id).images.push({url: "/uploads/"+file.name, thumb: '/uploads/thumbs/'+file.name, user: req.user.id});
				collection.save(function(err){
					if(err) return next(err);
					req.flash('success', { msg: 'Success! Image created.' });
					res.redirect('/collection/'+collection.slug+'/item/'+req.params.id);
				})
			},
			function (err) {
				return next(err);
			}
		);
	})
}

exports.image_delete = function(req, res, next){
	Collection.findOne({slug: req.params.slug}, function(err, collection){
		if(err) return next(err);
		var image = collection.items.id(req.params.id).images.id(req.params.image).remove()
		collection.save(function(err){
			if(err) return next(err);
			req.flash('success', { msg: 'Success! Image deleted.' });
			res.redirect('/collection/'+collection.slug+'/item/'+req.params.id);
		})
	})
}

exports.show = function(req, res, next){
	Collection.findOne({slug: req.params.slug}, function(err, collection){
    if(err) return next(err);
		var item = collection.items.id(req.params.id)
		if(item != undefined){
      res.render('item/show', {
        item: item,
        collection: collection,
        title: item.name
      });
		}else{
			res.redirect('/collection/'+collection.slug);
		}
  })
}
