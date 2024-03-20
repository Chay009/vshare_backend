const express = require("express");
const router = new express.Router();
const { upload } = require('../middleware/multer');

const { uploadOnCloudinary } = require('../services/cloudinary');
const { blurhashFromURL } = require("blurhash-from-url");
const Post = require("../model/Posts");
const fs = require("fs");
const User = require("../model/User");




router.post('/',upload.any('coverImage','photos'),async (req, res) => {


 console.log(req.body);
 console.log(req.files);

    const { caption, location, tags,creatorID } =req.body;
    const [coverImage,...photos] = req.files; // Assuming single file
    

    if(!caption || !location || !tags||req.files.length==0)
    {
      
      return res.status(404).json({"message":`some values are missing`});
    }
    
  
    const trimmedTags = tags.map(tag => tag.replace(/\s+/g, ' ').trim());
  
  console.log(coverImage);

  // Find the user by ID and retrieve only the 'email' field 
  const creator = await User.findOne({ _id: creatorID }).select('email username').exec();
  console.log(creator)

  if(!creator?.email)
  {
    return res.status(401).json({success: false,message:"creator not found"});
  }

 
   
    console.log('Tags:', tags);
    console.log('Tags:', trimmedTags);
  
  



  
    
        // Handle the uploaded files
        
   
       
    try {
        // Access form data
  
  
        // since we have local file in server offline true if we have to use public url offline false
        // offline true-local file in server  offline false-some public url
        
        const coverImageBlurhash = await blurhashFromURL(coverImage.path,{offline: true})
        
        // Upload cover image to Cloudinary
        const coverImageURL = await uploadOnCloudinary(coverImage.path);

        // Create an array to store photos data
        const photosData = await Promise.all(photos.map(async (photo) => {
            const photoURL = await uploadOnCloudinary(photo.path);
            const photoBlurhash = await blurhashFromURL(photo.path,{offline: true});
            return {
                url: photoURL,
                blurhash: {
                    encoded: photoBlurhash.encoded,
                    width: photoBlurhash.width,
                    height: photoBlurhash.height
                }
            };
        }));
   
        // Create a new Post document
        const newPost = new Post({
            caption: caption,
            location: location,
            tags: trimmedTags,
            coverImage: {
                url: coverImageURL,
                blurhash: {
                    encoded: coverImageBlurhash.encoded,
                    width: coverImageBlurhash.width,
                    height: coverImageBlurhash.height
                }
            },
            photos: photosData,
            creator:{
                creatorID:creator.id,
                creatorEmail:creator.email,
                creatorName:creator.username
            }
           
              
        });

        
        // Save the new Post document to MongoDB
        const savedPost = await newPost.save();

        console.log("files uploaded hashes created saved successfully")

        // Send a response
        res.json({
            success: true,
            message: 'Data received and processed successfully',
            newpost:savedPost
            // post: savedPost
        });

    } catch (error) {
        console.error('Error processing form data:', error);
        res.status(500).json({ success: false, message: 'Error processing form data' });
    
     }
     finally{
           // Cleanup: Unlink files
        
  try {
                if (coverImage && coverImage.path) {
                await fs.promises.unlink(coverImage.path);
                console.log(`The temporary file ${coverImage.path} has been removed - image uploaded to Cloudinary`);
                }

                await Promise.all(photos.map(async (photo) => {
                if (photo.path) {
                    await fs.promises.unlink(photo.path);
                    console.log(`The temporary file ${photo.path} has been removed - image uploaded to Cloudinary`);
                }
                }));
            } catch (unlinkError) {
                console.error('Error unlinking temporary files:', unlinkError);
            }

        
     }
});

module.exports = router;
