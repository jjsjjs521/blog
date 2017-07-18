var config = require('config-lite')(__dirname);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(config.mongodb, { useMongoClient: true});


var Schema = mongoose.Schema;

//mongoose.Promise = require('bluebird');
//自己制定mongoose使用的Promise
mongoose.Promise = global.Promise;

var moment = require('moment');//时间格式化
var objectIdToTimestamp = require('objectid-to-timestamp');//根据 ObjectId 生成时间戳


var userSchema = new Schema({
    name: {type: 'string', index: true, unique: true},
    password: {type: 'string'},
    avatar: {type: 'string'},
    gender: {type: 'string', enum: ['m', 'f', 'x']},
    bio: {type: 'string'}
});
var User = mongoose.model('User', userSchema);
exports.User = User;

var commentSchema = new Schema({
    author: {type: Schema.Types.ObjectId},
    content: {type: 'string'},
    postId: {type: Schema.Types.ObjectId}
})

commentSchema.index({postId: 1, _id: 1});// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
commentSchema.index({author: 1, _id: 1});// 通过用户 id 和留言 id 删除一个留言
var Comment = mongoose.model('Comment', commentSchema);
exports.Comment = Comment;

var postSchema = new Schema({
    author: {type: Schema.Types.ObjectId},
    title: {type: 'string'},
    content: {type: 'string'},
    pv: {type: 'number'}
});
postSchema.virtual('created_at').get(function () {
    return moment(objectIdToTimestamp(this._id)).format('YYYY-MM-DD HH:mm');
});


postSchema.virtual('commentsCount').get(function () {
    /* var postId = this._id;
     var asyncReadFile = async function () {
     var count = await Comment.count({postId: postId}).exec();
     return count;
     };
     asyncReadFile().then(function (count) {
     return count;
     });*/
    return 10;
});

postSchema.index({author: 1, _id: -1});// 按创建时间降序查看用户的文章列表
var Post = mongoose.model('Post', postSchema);

exports.Post = Post;



