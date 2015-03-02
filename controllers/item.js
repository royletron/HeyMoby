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
			    	console.log(image);
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

exports.show = function(req, res, next){
	Collection.findOne({slug: req.params.slug}, function(err, collection){
        if(err) return next(err);
        _.each(collection.items, function(item, idx){
            if(item._id == req.params.id){
                res.render('item/show', {
                    item: item,
                    title: item.name
                })
                console.log(item)
            }
        })
    })
}
