const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");
//=================================
//             Subscriber
//=================================

router.post("/saveComment", (req, res) => {
  // prettier-ignore
  console.log(req.body);
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    //populate("wirter") 로 가져오지만 save로는 쓸수 없다. 그래서
    // prettier-ignore
    Comment.find({"_id" : comment._id})
      .populate('writer')
      .exec((err, result) => {
          if(err) return res.json({success:false})
          res.status(200).json({success: true, result})
      })
  });
});

router.post("/getComments", (req, res) => {
  // prettier-ignore
  Comment.find({"postId" : req.body.videoId})
  .populate('writer')
  .exec((err, comments) => {
    if(err) return res.status(400).send(err);
    res.status(200).json({success:true, comments})
  })
});

module.exports = router;
