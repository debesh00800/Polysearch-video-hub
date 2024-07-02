// requiring mongoose
const mongoose=require("mongoose");
const express=require('express');
const app=express();
const bcrypt = require("bcrypt");
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
const cors = require("cors");
app.use(cors());

app.listen(3000,function(){
    console.log("Hello");
})

// app.get("/",function(req,res){
//     console.log(__dirname);
//     res.sendFile(__dirname+"/index.html")
// });

// connecting to database and creating database name fruitsdb

mongoose.connect("mongodb://127.0.0.1:27017/project");

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


const userSchema = new mongoose.Schema({
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  // Create a user model
  const User = mongoose.model('User', userSchema);


// creating model with collection name Fruit and which will stick to fruitSchema
//mongoose automatically converts singular to plural collection name here the string is collection name


const Fruit=mongoose.model("test",videoInfoSchema);






// Reading from database with mongoose correct way
//for the following need to know javascript promises async and await
//async funtions send returns in a different way
//following is how to find in db



app.post("/",function(req,res){
    (async () => {
        final=(await findd(req.body.f))
        
    // res.send(req.body.f+" "+req.body.s)
    // console.log("final "+ x);
    res.send(final);
    
      })()
    
   
})

app.use(bodyparser.json());

app.get('/video/search/', async (req, res) => {
    const searchText = req.query.text;
    console.log(searchText);
  
    try {
        const foundVideos =await Fruit.find( {$text: { $search: searchText } });
  
      res.json(foundVideos.slice(0,20));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/register', async (req, res) => {
    const { user_id, email, password } = req.body;
  
    try {
      // Check if the user with the given user_id or email already exists
      const existingUser = await User.findOne({ $or: [{ user_id }, { email }] });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with the provided user_id or email.' });
      }
  
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        user_id,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/login', async (req, res) => {
    const { user_id, password } = req.body;
  
    try {
      // Find the user by user_id
      const user = await User.findOne({ user_id });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid user_id or password.' });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid user_id or password.' });
      }
  
      res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


async function findd(a){
    const x=await Fruit.find( {$text: { $search: "The Bengali BadAss Song" } });
    
    console.log(flag);
    return await x;
    // console.log(x)
}


//updating and deleting data using mongoose

// establishing relations and embedding documents using mongoose
