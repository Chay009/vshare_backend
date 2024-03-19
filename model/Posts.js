const mongoose = require('mongoose');

const blurhashSchema = new mongoose.Schema({
    encoded: { type: String, required: true },
    width: { type: Number },
    height: { type: Number }
});

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    blurhash: blurhashSchema
});

const postSchema = new mongoose.Schema({
    caption: {
    type: String,
    required: true
 },
    location: { type: String,required: true },
    tags: { type: [String], required: true },
    coverImage: {
        url: { type: String, required: true },
        blurhash: blurhashSchema
    },
    photos: { type: [photoSchema] },
    creator:{

        creatorID:{type: String, required: true},
        creatorEmail:{type: String, required: true},
        creatorName:{type: String, required: true},
    }

}, { timestamps: true }); // Add timestamps option here




const Post = mongoose.model('Post', postSchema);

module.exports = Post;
