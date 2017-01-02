/**/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var dbUrl = 'mongodb://localhost:27017/weedBook';

var wbController = function (bookService) {


    var signIn = function (req, res) {
        console.log("sign in 1");
        if (!req.user) {
            console.log("sign in 2");

            var userName = req.body.userName;
            var password = req.body.password;

            mongodb.connect(dbUrl, function (err, db) {
                console.log("sign in 3");
                console.log(userName);
                console.log(password);
                var collection = db.collection('users');
                collection.findOne({name: userName, password: password}, function (err, results) {
                    console.log(results);
                    console.log(err);
                    if (results) {
                        //req.user = results;
                        res.send({msg: 'ok', data: results});
                    } else {
                        res.send({msg: 'user does not exist'});
                    }
                    db.close();
                });
            });
        } else {
            res.send('ok');
        }
    };

    var middleware = function (req, res, next) {
        console.log('---- middleWare ---');
        if (!req.stoner) {
            console.log('---- middleWare ---');
            console.log(req.headers)
            var userName = req.headers.stoner;
            var password = req.headers['stoner-pass'];

            console.log(userName);
            console.log(password);

            mongodb.connect(dbUrl, function (err, db) {
                var collection = db.collection('users');
                collection.findOne({name: userName, password: password}, function (err, results) {
                    if (results) {
                        console.log('middleware success');
                        req.stoner = results;
                        db.close();
                        next();
                    } else {
                        console.log('middleware fail');
                        db.close();
                        res.send({msg: 'user does not exist', data: null});
                    }

                });
            });
        }
        //next();
    };

    var follow = function (req, res) {
        mongodb.connect(dbUrl, function (err, db) {
            var followee = req.params.followee;
            var userId = req.user._id;
            var collection = db.collection('followers');
            var follower = {
                follower: userId,
                followee: followee
            };

            collection.insert(follower, function (err, results) {
                db.close();
                res.send(results);
            });
        });
    };

    //TODO
    var unFollow = function (req, res) {
        mongodb.connect(dbUrl, function (err, db) {
            var followee = req.params.followee;
            var userId = req.user._id;
            var collection = db.collection('followers');

            var follower = collection.findOne({folloer: userId, followee: followee}, function (err, result) {
                if (result) {
                    collection.remove({_id: result._id}, function (err, results) {
                        res.msg = results;
                    });
                }
            });
        });
    };

    var getWeedFeed = function (req, res) {

        //var userId = new ObjectId(req.params.id);
        var userId = new ObjectId(req.stoner._id);
        console.log('userId');
        console.log(userId);
        var limit = req.params.limit || 100;


        mongodb.connect(dbUrl, function (err, db) {
            var followers = db.collection('followers');
            var weedCards = db.collection('weedCards');

            followers.find({
                follower: userId
            }).toArray(function (err, results) {
                //  console.log(err);
                //  console.log(results);
                if (results) {
                    var followeeIds = [];

                    results.forEach(function (followee) {
                        //console.log(followee);
                        followeeIds.push(followee.followee);
                    });

                    var options = {
                        limit: limit,
                        //'skip': 10,
                        sort: [['lastModifiedDate', 1]]
                    };


                    //   console.log('followeeIds');
                    //  console.log(followeeIds);
                    followeeIds.push(userId);
                    //  console.log(limit);
                    weedCards.find({lastModifiedBy: {$in: followeeIds}}).sort({createdDate: -1}).limit(limit).toArray(
                        function (err, results) {
                            //     console.log(results);
                            res.send({msg: 'ok', data: results});
                            db.close();
                        });
                } else {
                    console.log('close');
                    db.close();
                    res.send({msg: 'fail', data: null});
                }
            });
        });
    };

    var getStonerFeed = function (req, res) {

        var userId = new ObjectId(req.params.id);
        console.log('userId');
        console.log(userId);
        var limit = req.params.limit || 100;


        mongodb.connect(dbUrl, function (err, db) {
            var followers = db.collection('followers');
            var weedCards = db.collection('weedCards');

            var options = {
                limit: limit,
                //'skip': 10,
                sort: [['lastModifiedDate', 1]]
            };

            followers.find({
                follower: userId
            }).toArray(function (err, results) {
                //  console.log(err);
                //  console.log(results);
                if (results) {
                    var followeeIds = [];

                    results.forEach(function (followee) {
                        //console.log(followee);
                        followeeIds.push(followee.followee);
                    });

                    var options = {
                        limit: limit,
                        //'skip': 10,
                        sort: [['lastModifiedDate', 1]]
                    };


                    console.log('followeeIds');
                    console.log(followeeIds);
                    console.log(limit);
                    weedCards.find({createdBy: {$in: followeeIds}}).sort({lastModifiedDate: -1}).limit(limit).toArray(
                        function (err, results) {
                            res.send({msg: 'ok', data: results});
                            db.close();
                        });
                } else {
                    console.log('close');
                    db.close();
                    res.send({msg: 'fail', data: null});
                }
            });
        });
    };

    var getStonerComments = function (req, res) {

        var userId = new ObjectId(req.params.id);
        console.log('userId');
        console.log(userId);
        var limit = req.params.limit || 100;


        mongodb.connect(dbUrl, function (err, db) {
            var followers = db.collection('followers');
            var weedCards = db.collection('weedCards');

            var options = {
                limit: limit,
                //'skip': 10,
                sort: [['lastModifiedDate', 1]]
            };

            followers.find({
                follower: userId
            }).toArray(function (err, results) {
                //  console.log(err);
                //  console.log(results);
                if (results) {
                    var followeeIds = [];

                    results.forEach(function (followee) {
                        //console.log(followee);
                        followeeIds.push(followee.followee);
                    });

                    var options = {
                        limit: limit,
                        //'skip': 10,
                        sort: [['lastModifiedDate', 1]]
                    };


                    console.log('followeeIds');
                    console.log(followeeIds);
                    console.log(limit);
                    weedCards.find({'commentsData.comments': {$elemMatch: {lastModifiedBy: userId}}}).sort({lastModifiedDate: -1}).limit(limit).toArray(
                        function (err, results) {
                            res.send({msg: 'ok', data: results});
                            db.close();
                        });
                } else {
                    console.log('close');
                    db.close();
                    res.send({msg: 'fail', data: null});
                }
            });
        });
    };

    var search = function (req, res) {

        var user = req.stoner;
        console.log(user);
        var limit = req.body.limit || 100;

        mongodb.connect(dbUrl, function (err, db) {
            var weedCards = db.collection('weedCards');

            weedCards.find({'commentsData.comments': {$elemMatch: {lastModifiedBy: userId}}}).sort({lastModifiedDate: -1}).limit(limit).toArray(
                function (err, results) {
                    res.send({msg: 'ok', data: results});
                    db.close();
                });

            weedCards.find({'commentsData.comments': {$elemMatch: {lastModifiedBy: userId}}}).sort({lastModifiedDate: -1}).limit(limit).toArray(
                function (err, results) {
                    res.send({msg: 'ok', data: results});
                    db.close();
                });

            console.log('close');
            db.close();
            res.send({msg: 'fail', data: null});

        });
    };

    var upVote = function (req, res) {
        mongodb.connect(dbUrl, function (err, db) {

            var user = req.stoner;
            var userId = new ObjectId(req.stoner._id);
            var postId = new ObjectId(req.body.postId);

            console.log('userId');
            console.log(userId);
            console.log('postId');
            console.log(postId);

            var col = db.collection('weedCards');

            col.findOne({
                _id: postId
            }, function (err, result) {
                var post = result;
                if (post) {

                    var upVoters = post.votesData.upVoters;
                    // console.log(upVoters);
                    var downVoters = post.votesData.downVoters;
                    // console.log(downVoters);

                    var found = false;
                    var index;
                    for (var i = 0; i < upVoters.length; i++) {
                        console.log(userId);
                        console.log(upVoters[i].lastModifiedBy);
                        if (upVoters[i].lastModifiedBy.toString() === userId.toString()) {
                            found = true;
                            index = i;
                            break;
                        }
                    }

                    if (found) {
                        post.votesData.up--;
                        upVoters.splice(index, 1);
                    } else {
                        for (var j = 0; j < downVoters.length; j++) {
                            if (downVoters[j].lastModifiedBy.toString() === userId.toString()) {
                                found = true;
                                index = j;
                                break;
                            }
                        }

                        if (found) {
                            post.votesData.down--;
                            downVoters.splice(index, 1);

                            post.votesData.up++;
                            upVoters.push({
                                _id: null,
                                lastModifiedBy: userId,
                                lastModifiedByName: user.name,
                                lastModifiedDate: new Date(),
                                inactive: false
                            });
                        } else {
                            //just upvote
                            post.votesData.up++;
                            upVoters.push({
                                _id: null,
                                lastModifiedBy: userId,
                                lastModifiedByName: user.name,
                                lastModifiedDate: new Date(),
                                inactive: false
                            });
                        }
                    }

                    post.lastOperationType = 'upVote';
                    post.lastModifiedBy = userId;
                    post.lastModifiedByName = user.name;
                    post.lastModifiedDate = new Date();

                    col.updateOne({_id: postId}, post, function (err, result) {
                        //console.log(result);
                        if (result) {
                            db.close();
                            res.send({msg: 'ok', data: post});
                        } else {
                            db.close();
                            res.send({msg: 'fail', data: null});
                        }
                    });
                }
            });
        });
    };

    var downVote = function (req, res) {
        var id = new ObjectId(req.params.id);
        mongodb.connect(dbUrl, function (err, db) {

            var user = req.stoner;
            var userId = new ObjectId(req.stoner._id);
            var postId = new ObjectId(req.body.postId);

            var col = db.collection('weedCards');

            col.findOne({
                _id: postId
            }, function (err, result) {
                var post = result;
                if (post) {

                    var upVoters = post.votesData.upVoters;
                    var downVoters = post.votesData.downVoters;

                    var found = false;
                    var index;
                    for (var i = 0; i < upVoters.length; i++) {
                        if (upVoters[i].lastModifiedBy.toString() === userId.toString()) {
                            found = true;
                            index = i;
                            break;
                        }
                    }

                    if (found) {
                        post.votesData.up--;
                        upVoters.splice(index, 1);

                        post.votesData.down++;
                        downVoters.push({
                            _id: null,
                            lastModifiedBy: userId,
                            lastModifiedByName: user.name,
                            lastModifiedDate: new Date(),
                            inactive: false
                        });
                    } else {
                        for (var j = 0; i < downVoters.length; j++) {
                            if (downVoters[i].lastModifiedBy.toString() === userId.toString()) {
                                found = true;
                                index = j;
                                break;
                            }
                        }

                        if (found) {
                            post.votesData.down--;
                            downVoters.splice(index, 1);
                        } else {
                            //just down vote
                            post.votesData.down++;
                            downVoters.push({
                                _id: null,
                                lastModifiedBy: userId,
                                lastModifiedByName: user.name,
                                lastModifiedDate: new Date(),
                                inactive: false
                            });
                        }
                    }

                    post.lastOperationType = 'downVote';
                    post.lastModifiedBy = userId;
                    post.lastModifiedByName = user.name;
                    post.lastModifiedDate = new Date();

                    col.updateOne({_id: postId}, post, function (err, result) {
                        if (result) {
                            db.close();
                            res.send({msg: 'ok', data: post});
                        } else {
                            db.close();
                            res.send({msg: 'fail', data: null});
                        }
                    });
                }
            });
        });
    };

    var addComment = function (req, res) {
        mongodb.connect(dbUrl, function (err, db) {

            var user = req.stoner._id;
            var userId = new ObjectId(req.stoner._id);
            var postId = new ObjectId(req.body.comment.postId);
            var content = req.body.comment.content;
            var location = req.body.comment.location;

            console.log(userId);
            console.log(postId);
            console.log(content);

            var col = db.collection('weedCards');
            col.findOne({
                _id: postId
            }, function (err, results) {
                console.log(results);
                if (results) {
                    var post = results;
                    post.commentsData.count++;
                    post.commentsData.comments.push({
                        _id: new ObjectId(),
                        content: content,
                        location: location,
                        lastModifiedBy: userId,
                        lastModifiedByName: user.name,
                        lastModifiedDate: new Date(),
                        inactive: false
                    });

                    post.lastOperationType = 'comment';
                    post.lastModifiedBy = userId;
                    post.lastModifiedByName = user.name;

                    col.updateOne({
                        _id: postId
                    }, {$set: {commentsData: post.commentsData}}, function (err, result) {
                        db.close();
                        res.send({msg: 'ok', data: post});
                    });
                } else {
                    db.close();
                    res.send({msg: 'fail', data: null});
                }
            });
        });
    };

    var addTag = function (req, res) {
        mongodb.connect(dbUrl, function (err, db) {

            var user = req.stoner._id;
            var userId = new ObjectId(req.stoner._id);
            var postId = new ObjectId(req.body.tag.postId);
            var tag = req.body.tag.content;
            // var location = req.body.tag.location;

            console.log(userId);
            console.log(postId);
            console.log(tag);

            var col = db.collection('weedCards');
            col.findOne({
                _id: postId
            }, function (err, results) {
                console.log(results);
                if (results) {
                    var post = results;
                    // tag = {
                    //     content: content,
                    //     lastModifiedBy: userId,
                    //     location: location,
                    //     lastModifiedDate: new Date(),
                    //     inactive: false
                    // };

                    var existingTag = [];
                    if (post.tags) {
                        existingTag = post.tags.filter(function (item) {
                            return item === tag;
                        });
                    } else {
                        post.tags = [];
                    }

                    console.log("-------------existingTag");
                    console.log(existingTag);

                    if (existingTag.length !== 0) {
                        //tag already exists
                        db.close();
                        res.send({msg: 'already exists', data: null});
                    } else {
                        //add to db
                        post.tags.push(tag);

                        post.lastOperationType = 'tag';
                        post.lastModifiedBy = userId;
                        post.lastModifiedByName = user.name;

                        col.update({
                            _id: postId
                        }, {$addToSet: {tags: tag}}, function (err, result) {

                            db.close();
                            res.send({msg: 'ok', data: post});
                        });
                    }

                } else {
                    db.close();
                    res.send({msg: 'fail', data: null});
                }
            });
        });
    };

    var updateTags = function (req, res) {
        mongodb.connect(dbUrl, function (err, db) {

            var userId = parseInt(req.stoner._id);
            var postId = new ObjectId(req.body.tag.postId);
            var tags = req.body.tag.tags;
            // var location = req.body.tag.location;

            console.log(userId);
            console.log(postId);
            console.log(tags);

            var col = db.collection('weedCards');
            col.findOne({
                _id: postId
            }, function (err, results) {
                console.log(results);
                if (results) {
                    var post = results;

                    if (tags) {
                        post.tags = tags;

                        post.lastOperationType = 'tag';
                        post.lastModifiedBy = userId;

                        col.update({
                            _id: postId
                        }, {$set: {tags: tags}}, function (err, result) {

                            db.close();
                            res.send({msg: 'ok', data: post});
                        });
                    }

                } else {
                    db.close();
                    res.send({msg: 'fail', data: null});
                }
            });
        });
    };

    var getWeedCard = function (req, res) {
        var id = new ObjectId(req.params.id);
        console.log(req.params);
        console.log(id);
        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('weedCards');
            collection.findOne({
                    _id: id
                },
                function (err, results) {
                    db.close();
                    if (results) {
                        res.send({msg: 'ok', data: results});
                    } else {
                        console.log('fail');
                        res.send({msg: 'not ok', data: null});
                    }

                });
        });
    };

    var getStoner = function (req, res) {
        var id = new ObjectId(req.params.id);
        console.log(id);
        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('users');
            collection.findOne({
                    _id: id
                },
                function (err, results) {
                    console.log(results);
                    if (results) {
                        db.close();
                        res.send({msg: "ok", data: results});
                    } else {
                        db.close();
                        res.send({msg: "fail", data: null});
                    }
                });
        });
    };

    var getStoners = function (req, res) {
        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('users');
            collection.find().toArray(
                function (err, results) {
                    console.log(results);
                    if (results) {
                        db.close();
                        res.send({msg: "ok", data: results});
                    } else {
                        db.close();
                        res.send({msg: "fail", data: null});
                    }
                });
        });
    };

    var addWeedCard = function (req, res) {
        console.log('addWeedCard');

        var user = req.stoner;
        var weedCardToCreate = req.body.weedCard;

        console.log('-----');

        console.log(user.name);
        console.log(weedCardToCreate);

        console.log('-----');

        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('weedCards');
            var weedCard = {
                _id : new ObjectId(),
                weedName: weedCardToCreate.name,
                desc: weedCardToCreate.desc,
                imageUrl: weedCardToCreate.imageUrl,
                createdDate: new Date(),
                createdBy: user._id,
                location: user.location,
                lastOperationType: 'post',
                lastModifiedBy: user._id,
                lastModifiedDate: new Date(),
                commentsData: {
                    count: 0,
                    comments: []
                },
                votesData: {
                    up: 0,
                    down: 0,
                    upVoters: [],
                    downVoters: []
                }
            };


            collection.insertOne(weedCard, function (err, results) {
                db.close();
                res.send({msg: 'ok', data: results.ops[0]});
            });

        });
    };

    var addFavorite = function (req, res) {
        var userId = parseInt(req.body.id);
        var favoriteId = new ObjectId(req.body.id);

        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('users');

            collection.findOne({_id: userId}, function (err, user) {
                if (user) {
                    var shoulAdd = true;
                    user.favorites.forEach(function (favoriteId) {
                        if (favoriteId === favoriteId) {
                            shoulAdd = false;
                        }
                    });
                    if (shoulAdd) {
                        user.favorites.push(favoriteId);
                        collection.save(user, function (err, result) {
                            db.close();
                            res.send(result)
                        });
                    } else {
                        db.close();
                        res.send("")
                    }
                } else {
                    res.send("user does not exist");
                    db.close();
                }
            });
        });
    };

    var removeFavorite = function (req, res) {
        var userId = parseInt(req.body.id);
        var favoriteId = new ObjectId(req.body.id);

        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('users');

            collection.findOne({_id: userId}, function (err, user) {
                if (user) {
                    for (var i = 0; i < user.favorites.length; i++) {
                        if (user.favorites[i] === favoriteId) {
                            user.favorites.splice(i, 1);
                        }
                    }
                } else {
                    res.send("user does not exist");
                    db.close();
                }
            });
        });
    };

    var favorites = function (req, res) {
        var id = new ObjectId(req.params.id);
        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('books');
            collection.findOne({
                    _id: id
                },
                function (err, results) {
                    db.close();
                });
        });
    };

    var signUp = function (req, res) {
        console.log(req.body);
        console.log('--body--');
        console.log(req.user);
        if (!req.user) {
            console.log(req.user);
            var userName = req.body.userName;
            var password = req.body.password;

            mongodb.connect(dbUrl, function (err, db) {
                var collection = db.collection('users');
                collection.findOne({userName: userName, password: password}, function (err, results) {
                    console.log(results);
                    if (!results) {
                        var user = {
                            name: req.body.name,
                            surname: req.body.surname,
                            age: req.body.age,
                            password: req.body.password,
                            imageUrl: req.body.imageUrl,
                            organisation: req.body.organisation,
                            position: req.body.position,
                            createdDate: new Date()
                        };

                        collection.insert(user, function (err, results) {
                            console.log(results);
                            console.log('signUp');
                            db.close();
                            req.user = results.ops[0];
                        });

                    } else {
                        db.close();
                        res.send('respond with a resource');
                    }

                });
            });
        }
    };

    var fillData = function (req, res) {
        console.log(req.body);
        console.log('--body--');
        console.log(req.user);

        var userCount = 2;
        var postPerUser = 2;

        var usersList = [];
        mongodb.connect(dbUrl, function (err, db) {
            var users = db.collection('users');
            users.remove({});


            for (var i = 0; i < userCount; i++) {
                var user = {
                    _id: new ObjectId(),
                    name: 'usr' + i,
                    surname: 'surname ' + i,
                    desc: 'Short description',
                    age: 10,
                    password: 'pass',
                    //  imageUrl: 'http://placehold.it/650x350',
                    imageUrl: 'assets/icons/rickAndMorty.jpg',
                    organisation: 'UN',
                    position: 'president',
                    createdDate: new Date()
                };

                usersList.push(user);
                users.insert(user, function (err, results) {
                    console.log(results);
                });
            }
            db.close();
        });

        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('followers');
            collection.remove({});
            for (var i = 0; i < userCount; i++) {

                for (var j = 0; j < userCount; j++) {

                    if (i !== j) {
                        var follower = {
                            follower: usersList[i]._id,
                            followee: usersList[j]._id
                        };

                        collection.insert(follower, function (err, results) {
                            db.close();
                        });
                    }
                }
            }
        });

        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('weedCards');
            collection.remove({});
            for (var i = 0; i < userCount; i++) {

                for (var j = 0; j < postPerUser; j++) {

                    console.log('------ user');
                    console.log(usersList[i]);
                    // if (i !== j) {
                    var weedCard = {
                        name: 'weedName --' + i + '--' + j,
                        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra varius quam sit amet vulputate.'
                        + 'Quisque mauris augue, molestie tincidunt condimentum vitae, gravida a libero. Aenean sit amet felis'
                        + 'dolor, in sagittis nisi. Sed ac orci quis tortor imperdiet venenatis. Duis elementum auctor accumsan.'
                        + 'Aliquam in felis sit amet augue' + i + '--' + j,
                        //  tags: ['tags--' + i + '--' + j],
                        imageSrc: 'assets/icons/rickAndMorty.jpg',
                        createdDate: new Date(),
                        createdBy: usersList[i]._id,
                        createdByName: usersList[i].name,
                        location: 'location--' + i + '--' + j,
                        lastOperationType: 'post',
                        lastModifiedBy: usersList[i]._id,
                        lastModifiedByName: usersList[i].name,
                        lastModifiedDate: new Date(),
                        commentsData: {
                            count: 1,
                            comments: [
                                {
                                    lastModifiedBy: usersList[i]._id,
                                    lastModifiedByName: usersList[i].name,
                                    content: 'first comment ' + i + ' ' + j,
                                    location: 'location ' + i + ' ' + j
                                }]
                        },
                        votesData: {
                            up: 0,
                            down: 0,
                            upVoters: [],
                            downVoters: []
                        }
                    };

                    collection.insert(weedCard, function (err, results) {
                        db.close();
                    });
                    // }
                }
            }
        });

        res.send('end');

    };

    var findOne = function (req, res) {
        var id = new ObjectId(req.params.id);
        mongodb.connect(dbUrl, function (err, db) {
            var collection = db.collection('weedCards');
            collection.findOne({},
                function (err, results) {
                    db.close();
                    res.send(results);
                });
        });
    };


    return {
        middleware: middleware,
        getWeedFeed: getWeedFeed,
        upVote: upVote,
        downVote: downVote,
        addComment: addComment,
        addTag: addTag,
        updateTags: updateTags,
        getWeedCard: getWeedCard,
        getStoner: getStoner,
        addWeedCard: addWeedCard,
        addFavorite: addFavorite,
        favorites: favorites,
        follow: follow,
        unFollow: unFollow,
        signUp: signUp,
        signIn: signIn,
        fillData: fillData,
        findOne: findOne,
        getStonerFeed: getStonerFeed,
        getStonerComments: getStonerComments,
        getStoners: getStoners,
        search: search
    };
};

module.exports = wbController;