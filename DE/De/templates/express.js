const mongoose=require("mongoose");
const express=require('express');
const app=express();
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/project");

// creating schema
app.listen(3500,function(){
    console.log("Hello");
})
app.get("/", function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
});

app.get("/search-results", async function (req, res) {
    try {
        const searchResults = await findd(req.query.search_query);
        res.json(searchResults);
    } catch (error) {
        console.error('Error retrieving search results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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
app.post("/",function(req,res){
    (async () => {
        final=(await findd(req.body.search_query))
        
    // res.send(req.body.f+" "+req.body.s)
    console.log("final "+ final[0]);
    res.send(final);
    
      })()
    
   
})


async function findd(a){
    const x=await Fruit.find({ $text: { $search: "The Bengali BadAss Song" }});
    let flag=0;
    const firstten=x.slice(0,10);
    // console.log(flag);
    return await firstten;
    // console.log(x)
}