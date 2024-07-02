// requiring mongoose
var mysql = require('mysql2');
const mongoose=require("mongoose");
const express=require('express');
const app=express();
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
const cors = require("cors");
app.use(cors());

app.listen(3500,function(){
})

// app.get("/",function(req,res){
//     res.sendFile(__dirname+"/index.html")
// });

// connecting to database and creating database name fruitsdb

mongoose.connect("mongodb://127.0.0.1:27017/project");

const videoCommentSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
  },
  comments: [
    {
      type: String,
      required: true,
    },
  ],
});

// creating schema

const videoInfoSchema = new mongoose.Schema({
    videoInfo:{
    snippet: {
        thumbnails: {
            default: {
                url: String,
                width: Number,
                height: Number,
            },
            high: {
                url: String,
                width: Number,
                height: Number,
            },
            medium: {
                url: String,
                width: Number,
                height: Number,
            },
        },
        tags: {
            type: [String],
            index: 'text', // Add 'text' index for tags
        },
        channelId: String,
        publishedAt: Date,
        liveBroadcastContent: String,
        channelTitle: String,
        title: {
            type: String,
            index: 'text', // Add 'text' index for title
        },
        categoryId: String,
        localized: {
            description: String,
            title: String,
        },
        description: String,
    },
    kind: String,
    statistics: {
        commentCount: Number,
        viewCount: Number,
        favoriteCount: Number,
        dislikeCount: Number,
        likeCount: Number,
    },
    etag: String,
    id: String,
}},{collection: 'test'});


// creating model with collection name Fruit and which will stick to fruitSchema
//mongoose automatically converts singular to plural collection name here the string is collection name


const Fruit=mongoose.model("test",videoInfoSchema);


const Comment=mongoose.model("comment",videoCommentSchema);



// Reading from database with mongoose correct way
//for the following need to know javascript promises async and await
//async funtions send returns in a different way
//following is how to find in db



app.post("/",function(req,res){
    (async () => {
        final=(await findd(req.body.f))
        
    // res.send(req.body.f+" "+req.body.s)
    res.send(final);
    
      })()
    
   
})
app.get('/addcomment', async (req, res) => {
  const searchText = req.query.text;
  

  try {
    // Use findOne to find a single document based on the videoId
    const result = await Comment.findOne({ videoId:searchText });

    if (result) {
      console.log('Comments for videoId:', result);
      // console.log(result.comments);
    } else {
      console.log('No comments found for videoId:', searchText);
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/comment', async (req, res) => {
  const searchText = req.query.text;
  const valuesArray = searchText.split(',');

  try {
    // Use findOneAndUpdate to find a document by videoId and update it
    console.log(searchText);
    const result = await Comment.findOneAndUpdate(
      {videoId: valuesArray[0] },
      { $push: { comments: valuesArray[1] } },
      { upsert: true, new: true } // Creates a new document if not found, returns the updated document
    );

    if (result) {
      console.log('Comment added:', result);
    } else {
      console.log('Video not found for videoId:', videoId);
    }
  }catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.use(bodyparser.json());

app.get('/video/search/', async (req, res) => {
    const searchText = req.query.text;
  
    try {
        const foundVideos =await Fruit.find( {$text: { $search: searchText } });
  
      res.json(foundVideos.slice(0,20));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  app.get('/increase', async (req, res) => {
    const videoId = req.query.text; // Assuming text parameter contains the video ID
    const valuesArray = videoId.split(',');
    const isLiked=valuesArray[1];
  
    try {
        // Find the video by ID and update its likeCount
        const query = { 'videoInfo.id': valuesArray[0] };

        // Fetch the document and convert likeCount to a number
        const video = await Fruit.findOne(query);
        const currentLikeCount = parseInt(video.videoInfo.statistics.likeCount);

        // Update the document with the incremented likeCount
        var updatedVideo;
        // if(isLiked=='true'){
        const update = { $set: { 'videoInfo.statistics.likeCount': currentLikeCount +1 } };
        const options = { new: true };
        updatedVideo = await Fruit.findOneAndUpdate(query, update, options);
        // }
        // else if(isLiked=='false'){
        //   const update = { $set: { 'videoInfo.statistics.likeCount': currentLikeCount -1 } };
        // const options = { new: true };
        // updatedVideo = await Fruit.findOneAndUpdate(query, update, options);
        // }

        // Perform the update
        

        if (updatedVideo) {
            res.json(updatedVideo);
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/decrease', async (req, res) => {
  const videoId = req.query.text; // Assuming text parameter contains the video ID

  try {
      // Find the video by ID and update its likeCount
      const query = { 'videoInfo.id': videoId };

      // Fetch the document and convert likeCount to a number
      const video = await Fruit.findOne(query);
      const currentLikeCount = parseInt(video.videoInfo.statistics.dislikeCount);

      // Update the document with the incremented likeCount
      const update = { $set: { 'videoInfo.statistics.dislikeCount': currentLikeCount + 1 } };
      const options = { new: true };

      // Perform the update
      const updatedVideo = await Fruit.findOneAndUpdate(query, update, options);

      if (updatedVideo) {
          res.json(updatedVideo);
      } else {
          res.status(404).json({ error: 'Video not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
  app.get('/recommend', async (req, res) => {
    const searchText = req.query.text;
    const valuesArray = searchText.split(',');
    console.log(searchText);
  
    try {
      
      const uniqueValues = new Set(valuesArray);
const ans = [];

for (const value of uniqueValues) {
  const foundVideos = await Fruit.find({ $text: { $search: value } });
  
  // Filter out duplicate videos based on videoInfo.id
  // const uniqueVideos = foundVideos.filter((video, index, self) =>
  //     index === self.findIndex((v) => (
  //         v.videoInfo.id === video.videoInfo.id
  //     ))
  // );

  ans.push(foundVideos.slice(0, 8));
}
// Flatten the array and convert it to a Set to get unique values
// const unique = [...new Set(ans.flat())];

// Create a new array based on unique videoInfo.id
// const newArray = unique.map(video => video.videoInfo.id);

console.log(ans);
// const unique = [...new Set(ans.flat())];

res.json(ans);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'debesh1234',
    database: 'clickdb'
  });
  app.get('/searchsqlclick', (req, res) => {
    const userIdToSearch = req.query.text;
  
    // Perform the search query with sorting by timestamp
    const searchQuery = 'SELECT * FROM click_through_log WHERE user_id = ? ORDER BY timestamp DESC';
  
    // Use the connection pool to execute the query
    db.query(searchQuery, [userIdToSearch], (err, results) => {
      if (err) {
        console.error('Error executing search query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Send the sorted results back to the frontend
      
      res.json(results);
    });
});

  app.get('/insertClick', (req, res) => {
    const received= req.query.text;
    // const videoId = 3; // replace with the actual video ID
    // const ranking = 5; // replace with the actual ranking
    // const userId = 123; // replace with the actual user ID
    // const concatenatedString = 'debesh1,3,5,123';

// Split the string by commas
const valuesArray = received.split(',');

// Extract values separately
const searchQuery = valuesArray[0];
const videoId = valuesArray[1]; // Convert to integer
const ranking = parseInt(valuesArray[2], 10); // Convert to integer
const userId = parseInt(valuesArray[3], 10); // Convert to integer
const link=valuesArray[4];
const title=valuesArray[5];
const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    const sql = "INSERT INTO click_through_log (search_query, video_id, ranking, user_id,thumbnail_link,video_title) VALUES (?, ?, ?, ?,?,?)";
    db.query(sql, [searchQuery, videoLink, ranking, userId,link,title], (err, result) => {
      if (err) {
        console.error('Error inserting click-through information:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Inserted Successfully');
      }
    });
  });
async function findd(a){
    const x=await Fruit.find( {$text: { $search: "The Bengali BadAss Song" } });
    
    return await x;
}


//updating and deleting data using mongoose

// establishing relations and embedding documents using mongoose
