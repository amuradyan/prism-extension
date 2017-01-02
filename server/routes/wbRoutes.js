var express = require('express');
var wbRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
//var passport = require('passport');

var router = function () {

    var url = 'mongodb://localhost:27017/weedBook';

    var wbController = require('../controllers/wbController')(null);

    wbRouter.route('/home')
        .all(wbController.middleware)
        .get(wbController.getWeedFeed);

    wbRouter.route('/weedFeed')
        .all(wbController.middleware)
        .get(wbController.getWeedFeed);

    wbRouter.route('/stonerFeed/:id')
        .all(wbController.middleware)
        .get(wbController.getStonerFeed);

    wbRouter.route('/stonerComments/:id')
        .all(wbController.middleware)
        .get(wbController.getStonerComments);

    wbRouter.route('/weedCard/:id')
        .all(wbController.middleware)
        .get(wbController.getWeedCard);

    wbRouter.route('/stoner/:id')
        .all(wbController.middleware)
        .get(wbController.getStoner);

    wbRouter.route('/stoners')
        .all(wbController.middleware)
        .get(wbController.getStoners);

    wbRouter.route('/search')
        .all(wbController.middleware)
        .get(wbController.search);

    wbRouter.route('/addWeedCard')
        .all(wbController.middleware)
        .post(wbController.addWeedCard);

    wbRouter.route('/addComment')
        .all(wbController.middleware)
        .post(wbController.addComment);

    wbRouter.route('/addTag')
        .all(wbController.middleware)
        .post(wbController.addTag);

    wbRouter.route('/updateTags')
        .all(wbController.middleware)
        .post(wbController.updateTags);

    wbRouter.route('/upVote')
        .all(wbController.middleware)
        .post(wbController.upVote);

    wbRouter.route('/downVote')
        .all(wbController.middleware)
        .post(wbController.downVote);

    wbRouter.route('/signUp')
        .post(wbController.signUp);

    wbRouter.route('/signIn')
        .post(wbController.signIn);

    wbRouter.route('/fillData')
        .all(function (req, res, next) {
            console.log('dill data');
            next();
        })
        .get(wbController.fillData);

    wbRouter.route('/findOne')
        .get(wbController.findOne);

    return wbRouter;
};

module.exports = router;