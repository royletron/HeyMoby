var fs = require('fs');
var easyimg = require('easyimage');
/**
 * GET /uploads
 * Collection index.
 */
// exports.index = function(req, res) {
// 	uploader.get(req, res, function (obj) {
//       res.send(JSON.stringify(obj));
//   });
// };


exports.upload = function(req, res) {
  var imageName = req.files.avatar.name

  /// If there's an error
  if(!imageName){

    console.log("There was an error")
    res.redirect("/");
    res.end();

  }
  easyimg.rescrop({
     src:req.files.avatar.path, dst:'public/uploads/thumbs/'+imageName,
     width:250, height:250,
     x:0, y:0
  }).then(
    function(image) {
      res.json({original: 'uploads/'+imageName, thumb: 'uploads/thumbs/'+imageName});
    },
    function (err) {
      console.log(err);
    }
  );
};
 
// exports.delete = function(req, res) {
//   uploader.delete(req, res, function (obj) {
//       res.send(JSON.stringify(obj));
//   });
// };