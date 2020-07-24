const express = require("express");
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");
//=================================
//             Subscriber
//=================================

router.post("/subscribeNumber", (req, res) => {
  // prettier-ignore
  Subscriber.find({ "userTo": req.body.userTo })
  .exec((err, subscribe) => {
    if(err) return res.status(400).send(err);
    return res.status(200).json({success:true , subscribeNumber: subscribe.length});
  })
});

router.post("/subscribed", (req, res) => {
  // prettier-ignore
  Subscriber.find({"userTo" : req.body.userTo, "userFrom" : req.body.userFrom})
  .exec((err, subscribe) => {
      if(err) return res.status(400).send(err);
      let result = false;
      if(subscribe.length !== 0){
          result = true;
      }
      return res.status(200).json({success:true, subscribed: result})
      
  });
});

router.post("/unSubscribe", (req, res) => {
  // prettier-ignore
  Subscriber.findOneAndDelete({"userTo" : req.body.userTo, "userFrom" : req.body.userFrom})
  .exec((err, doc) => {
    if(err) return res.status(400).send(err);
    return res.status(200).json({success:true, doc});
  });
});

router.post("/subscribe", (req, res) => {
  console.log(req.body);
  const subscribe = new Subscriber(req.body);
  // prettier-ignore
  subscribe.save((err, doc) => {
    if(err) return res.json({success:false, err});
    return res.status(200).json({success:true});
  })
});

module.exports = router;
