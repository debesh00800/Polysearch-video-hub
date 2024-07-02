

function performSearch() {
    var searchQuery = document.getElementById('search_query').value;
    console.log(searchQuery);
    console.log(window.myData);

    // Make an AJAX request to the server to perform the search and get ranking data
    fetch('/get_ranking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: searchQuery }),
    })
    .then(response => response.json())
    .then(data => {
        // Update the #current_video_panel and #ranking_list based on the search results
        updateCurrentVideo(data.currentVideo);
        updateRankingList(data.ranking);
    })
    .catch(error => console.error('Error:', error));
}

async function searchVideos() {
    const searchText = document.getElementById('search_query').value;
    console.log(searchText);

    try {
      const response = await fetch(`http://localhost:3500/video/search?text=${encodeURIComponent(searchText)}`);
      const data = await response.json();
      searchsql();

      initializeRankingList(data,searchText);

      console.log('Found videos:', data);
      // Process and display the found videos as needed
    } catch (error) {
      console.error('Error searching for videos:', error);
    }
  }
//   async function recommendation(retreived) {
//     const searchText = document.getElementById('search_query').value;
//     console.log(searchText);
//     const searches=[];
//     retreived.forEach(function(video,index){
//         searches.push(video.search_query);
//     });
//     console.log(searches);

//     try {
//       const response = await fetch(`http://localhost:3500/recommend?text=${encodeURIComponent(searches)}`);
//       const data = await response.json();
      
//         initializeRecommendList(data.slice(0,6));
//       console.log('Found videos:', data);
//       // Process and display the found videos as needed
//     } catch (error) {
//       console.error('Error searching for videos:', error);
//     }
//   }
//   function initializeRecommendList(rankingData) {
//     var rankingList = document.getElementById('recommend_list');
//     console.log(rankingData);
//     rankingData.forEach(function(video, index) {
//         var listItem = document.createElement('li');
//         const base=video[0].videoInfo.snippet;
//         console.log(base.title)
//         listItem.className = 'recommend-item';
//         listItem.innerHTML = `
//             <img src="${base.thumbnails.default.url}" alt="Thumbnail">
//             <div class="ranking-item-details">
//                 <h4>${base.title}</h4>
                
                
//             </div>
//         `;
// // <p>${base.description}</p>
//         // Add a click event listener to each ranking item
//         listItem.addEventListener('click', function() {
//             updateCurrentVideo(video,searchText);
//         });

//         rankingList.appendChild(listItem);
//     });
// }
async function recommendation(retreived) {
    const searchText = document.getElementById('search_query').value;
    console.log(searchText);
    console.log("qwerty");
    console.log(retreived);

    const searches = [];
    retreived.forEach(function (video, index) {
        searches.push(video.search_query);
    });
    console.log(searches);
    

    try {
        // Assuming your Neo4j API endpoint is running on http://localhost:7474/recommend
    console.log("qwerty");
    console.log(retreived[0].video_id);

        const response = await fetch(`http://localhost:3500/recommend?text=${encodeURIComponent(searches)}`);
        const data = await response.json();
        console.log("sam ",response);
        initializeRecommendList(data);
        console.log('Found videos:', data);
        // Process and display the found videos as needed
    } catch (error) {
        console.error('Error searching for videos:', error);
    }
}

function initializeRecommendList(rankingData) {
    var rankingList = document.getElementById('recommend_list');
    console.log("recommendations as");
    console.log(rankingData[0]);
    for(var i=0;i<rankingData.length;i++){
    rankingData[i].forEach(function (video, index) {
        var listItem = document.createElement('li');
        const base = video.videoInfo.snippet;
        console.log(base.title);
        listItem.className = 'recommend-item';
        listItem.innerHTML = `
            <img src="${base.thumbnails.default.url}" alt="Thumbnail">
            <div class="ranking-item-details">
                <h4>${base.title}</h4>
            </div>
        `;

        // Add a click event listener to each ranking item
        listItem.addEventListener('click', function () {
            updateCurrentVideo(video, searchText);
        });
    
        rankingList.appendChild(listItem);
    });
}
}


// function updateCurrentVideo(videoData) {
//     // Example: Update the current video panel with received data
//     var currentVideoPanel = document.getElementById('current_video_panel');
//     var currentVideoContent = document.getElementById('current_video_content');

//     currentVideoContent.innerHTML = `
//         <h3 style="color: #ffffff;">${videoData.title}</h3>
//         <p style="color: #ecf0f1;">${videoData.description}</p>
//         <!-- Add more video details as needed -->
//     `;
// }
function initializeRankingList(rankingData,searchText) {
    var rankingList = document.getElementById('ranking_list');
    console.log(rankingData);
    rankingData.forEach(function(video, index) {
        var listItem = document.createElement('li');
        const base=video.videoInfo.snippet;
        listItem.className = 'ranking-item';
        listItem.innerHTML = `
            <img src="${base.thumbnails.default.url}" alt="Thumbnail">
            <div class="ranking-item-details">
                <h4>${base.title}</h4>
                
                
            </div>
        `;
// <p>${base.description}</p>
        // Add a click event listener to each ranking item
        listItem.addEventListener('click', function() {
            updateCurrentVideo(video,searchText);
        });

        rankingList.appendChild(listItem);
    });
}
function initializeHistoryList(rankingData) {
    console.log("history reached");
    var rankingList = document.getElementById('history_list');
    // console.log(rankingData[0]);
    rankingData.forEach(function(video, index) {
        var listItem = document.createElement('li');
        // const base=video.videoInfo.snippet;
        console.log(video.thumbnail_link);
        listItem.className = 'history-item';
        listItem.innerHTML = `
    <img src="${video.thumbnail_link}" alt="Thumbnail">
    <div class="ranking-item-details">
        <h4>${video.video_title}</h4>
        <h4><span>search_query : ${video.search_query}</span></h4>
        <a href="${video.video_id}">link</a>
    </div>
`;
        rankingList.appendChild(listItem);
// <p>${base.description}</p>
        // Add a click event listener to each ranking item
        
    });
}
function updateRankingList(rankingData) {
    console.log(rankingData);
    // Example: Update the ranking list with received data
    var rankingList = document.getElementById('ranking_list');
    rankingList.innerHTML = '';

    

    rankingData.forEach(video => {
        var listItem = document.createElement('li');
        listItem.innerHTML = `
            <h4>${video.rank}. ${video.title}</h4>
            <p>${video.videoInfo.snippet.title}</p>
            <!-- Add more video details as needed -->
        `;
        rankingList.appendChild(listItem);
    });
}
var videoid;
async function clickthrough(searchText,id,link,title){
    const searchQuery = searchText; // replace with your actual search query
    const videoId = id; // replace with the actual video ID
    const ranking = 5; // replace with the actual ranking
    const userId = 123; // replace with the actual user ID
    const videotitle=title;
    const thumbnail= link;
    
    // var id=videoData.videoInfo.id;
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
      const senddata=[searchQuery,videoLink,ranking,userId,link,title];
      
      const response = await fetch(`http://localhost:3500/insertClick?text=${encodeURIComponent(senddata)}`);
      const data = await response.json();
  
      
  
      console.log('Found click through :', data);
      // Process and display the found videos as needed
    } catch (error) {
      console.error('Error searching for click through:', error);
    }
}

async function searchsql() {
    const userid = 123;
    // console.log(searchText);

    try {
      const response = await fetch(`http://localhost:3500/searchsqlclick?text=${encodeURIComponent(userid)}`);
      const data = await response.json();
      recommendation(data.slice(0,10));
      initializeHistoryList(data.slice(0,10));

    //   initializeRankingList(data,searchText);


      console.log('Found videos:', data);
      // Process and display the found videos as needed
    } catch (error) {
      console.error('Error searching for videos:', error);
    }
  }
// Update the current video panel with received data
function displaycomments(data){
    // const commentText = document.getElementById('comment').value;
    const commentsList = document.getElementById('comments-list');
   
    const video_id=document.getElementById('video-id').innerText;
    
    console.log("comment ke liye");
    console.log(video_id);
    var x=data.comments;
    // Create a new list item for the comment
    for(var i=0;i<x.length;i++){
        if(x[i].length>0){
    const commentItem = document.createElement('li');
    commentItem.innerHTML = `
        <p>${x[i]}</p>
        <button type="button" onclick="likeComment(this)">👍</button>
        <span class="like-count">0</span>
        <button type="button" onclick="dislikeComment(this)">👎</button>
        <span class="dislike-count">0</span>
    `;

    // Append the new comment to the comments list
    commentsList.appendChild(commentItem);
        }
    }
    // addcommenttodatabase(video_id,commentText);
}
async function findcomment(id) {
    // const userid = 123;
    // console.log(searchText);
  
    try {
        console.log("comments aa rhe haibwhwdkjwehhw  ")
      const response = await fetch(`http://localhost:3500/addcomment?text=${encodeURIComponent(id)}`);
      const data = await response.json();
    //   recommendation(data.slice(0,10));
    //   initializeHistoryList(data.slice(0,10));

    //   initializeRankingList(data,searchText);

  
      console.log('Found comments:', data.comments);
      displaycomments(data);
      // Process and display the found videos as needed
    } catch (error) {
      console.error('Error :', error);
    }
  }
function initializeCommentList(id){
    findcomment(id);
}
 function updateCurrentVideo(videoData,searchText) {
    console.log("clicked ");
    console.log(videoData);
    
    var videoThumbnail = document.getElementById('video-thumbnail');
    var videoTitle = document.getElementById('video-title');
    var videoDescription = document.getElementById('video-description');
    var channelTitle = document.getElementById('channel-title');
    var publishedDate = document.getElementById('published-at');
    var likesCount = document.getElementById('likes-count');
    var dislikesCount = document.getElementById('dislikes-count');
    var commentCount = document.getElementById('comment-count');
    var videoplay1=document.getElementById('video-iframe');
    var videoplay=document.getElementById('video');
    var idofvideo=document.getElementById('video-id');
    // Update HTML elements with received data
    const base=videoData.videoInfo.snippet;
    
    var id=videoData.videoInfo.id;
    initializeCommentList(id);
    const videoLink = `https://www.youtube.com/watch?v=${id}`;
    
    const videoLink1 = `https://www.youtube.com/embed/${id}`;
    console.log(videoLink);
    console.log(videoLink1);
    console.log(videoData.videoInfo.statistics.likeCount);
    console.log(base.title);
    clickthrough(searchText,id,base.thumbnails.high.url,base.title);
    // videoplay.href=videoLink;
    idofvideo.innerText=id;
    videoplay1.src=videoLink1;
    // videoThumbnail.src = base.thumbnails.high.url;
    videoTitle.innerText = base.title;
    videoDescription.innerText = base.description;
    channelTitle.innerText = base.title;
    publishedDate.innerText = base.publishedAt;
    likesCount.innerText = videoData.videoInfo.statistics.likeCount || 0;
    dislikesCount.innerText =videoData.videoInfo.statistics.dislikeCount || 0;
    commentCount.innerText = videoData.videoInfo.statistics.commentCount || 0;
}
// Add this function to your existing script.js file

document.addEventListener("DOMContentLoaded", function() {
    // Assume you have an array of ranking data called 'rankingData'
    var rankingData = [
        { 
            id: 1, 
            title: 'Video 1', 
            description: 'Description 1', 
            thumbnailUrl: 'path/to/image1.jpg',
            likes: 100,
            dislikes: 20,
            comments: 50,
            publishedDate: '2023-01-01'
        },
        { 
            id: 2, 
            title: 'Video 2', 
            description: 'Description 2', 
            thumbnailUrl: 'path/to/image2.jpg',
            likes: 150,
            dislikes: 10,
            comments: 30,
            publishedDate: '2023-01-05'
        },
        
        { 
            id: 10, 
            title: 'Video 10', 
            description: 'Description 10', 
            thumbnailUrl: 'path/to/image10.jpg',
            likes: 120,
            dislikes: 15,
            comments: 40,
            publishedDate: '2023-01-10'
        }
    ];

    // <p>Likes: ${video.likes}</p>
                    // <p>Dislikes: ${video.dislikes}</p>
                    // <p>Comments: ${video.comments}</p>
    // Function to initialize the ranking list
    function initializeRankingList(rankingData) {
        var rankingList = document.getElementById('ranking_list');

        rankingData.forEach(function(video, index) {
            var listItem = document.createElement('li');
            listItem.className = 'ranking-item';
            listItem.innerHTML = `
                <img src="${video.thumbnailUrl}" alt="Thumbnail">
                <div class="ranking-item-details">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                    <p>Likes: ${video.likes}</p>
                    <p>Dislikes: ${video.dislikes}</p>
                    <p>Comments: ${video.comments}</p>
                    
                    <p>Published Date: ${video.publishedDate}</p>
                </div>
            `;

            // Add a click event listener to each ranking item
            listItem.addEventListener('click', function() {
                updateCurrentVideo(video);
            });

            rankingList.appendChild(listItem);
        });
    }

    // Call the function to initialize the ranking list
    initializeRankingList();

    // Update the current video panel with received data
    // Update the current video panel with received data
// Update the current video panel with received data
// function updateCurrentVideo(videoData) {
//     var videoThumbnail = document.getElementById('video-thumbnail');
//     var videoTitle = document.getElementById('video-title');
//     var videoDescription = document.getElementById('video-description');
//     var likesCount = document.getElementById('likes-count');
//     var dislikesCount = document.getElementById('dislikes-count');
//     var commentsCount = document.getElementById('comment-count');
//     var publishedDate = document.getElementById('published-at');

//     // Update HTML elements with received data
//     videoThumbnail.src = videoData.thumbnailUrl;
//     videoTitle.innerText = videoData.title;
//     videoDescription.innerText = videoData.description;
//     likesCount.innerText = videoData.likes || 0; // Ensure likesCount is defined or default to 0
//     dislikesCount.innerText = videoData.dislikes || 0; // Ensure dislikesCount is defined or default to 0
//     commentsCount.innerText = videoData.comments || 0; // Ensure commentsCount is defined or default to 0
//     publishedDate.innerText = videoData.publishedDate;
// }


});

// Function to initialize the YouTube API
// function onYouTubeIframeAPIReady() {
//     // Create a new YouTube player with the provided video ID
//     player = new YT.Player('current_video_content', {
//         height: '315',
//         width: '560',
//         videoId: 'P8P_S1Fjl_Q', // Replace with your desired video link
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//         }
//     });
// }

// Function to perform actions when the player is ready
// function onPlayerReady(event) {
//     // Do something when the player is ready, if needed
// }

// // Function to perform actions when the player's state changes
// function onPlayerStateChange(event) {
//     // Do something when the player's state changes, if needed
// }

// // Function to search for videos (you can replace this with your actual search logic)
// function searchVideos() {
//     // Add your video search logic here
// }

// // Function to like the video (you can replace this with your actual like logic)
// function likeVideo() {
//     // Add your like logic here
// }

// // Function to dislike the video (you can replace this with your actual dislike logic)
// function dislikeVideo() {
//     // Add your dislike logic here
// }
// script.js

// Sample video data (replace this with your actual data)
const sampleVideo = {
    title: "Sample Video Title",
    thumbnail: "path/to/thumbnail.jpg",
    query: "Sample Query",
    searchTime: new Date().toLocaleString(),
    // Add other video details as needed
};

// Function to display video details in the current panel
// function displayVideoDetails(video) {
//     // Update the current video details in the panel
//     document.getElementById("video-title").innerText = video.title;
//     document.getElementById("video-thumbnail").src = video.thumbnail;
//     // Update other video details as needed
// }

// Function to update video history
function updateVideoHistory(video) {
    const historyList = document.getElementById("history_list");
    
    // Create a new list item for the video history
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <img src="${video.thumbnail}" alt="Video Thumbnail">
        <div>
            <p>${video.title}</p>
            <p>Query: ${video.query}</p>
            <p>Searched at: ${video.searchTime}</p>
        </div>
    `;

    // Add the new list item to the history list
    historyList.appendChild(listItem);
}

// Function to handle video search
// function searchVideos() {
    
//     const videoData = {
//         title: "Searched Video Title",
//         thumbnail: "path/to/searched/thumbnail.jpg",
//         query: document.getElementById("search_query").value,
//         searchTime: new Date().toLocaleString(),
//         // Add other video details as needed
//     };

//     // Display the video details in the current panel
//     displayVideoDetails(videoData);

//     // Update the video history
//     updateVideoHistory(videoData);
// }
function showDetails() {
    // Show the details container
    document.getElementById('details-container').style.display = 'block';

    // Update the details with the current video information
    document.getElementById('video-title').innerText = document.getElementById('video-title').innerText;
    document.getElementById('video-description').innerText = document.getElementById('video-description').innerText;
    document.getElementById('channel-title').innerText = document.getElementById('channel-title').innerText;
    document.getElementById('published-at').innerText =  document.getElementById('published-at').innerText;
    document.getElementById('likes-count').innerText =  document.getElementById('likes-count').innerText;
    document.getElementById('dislikes-count').innerText =  document.getElementById('dislikes-count').innerText;
    document.getElementById('comment-count').innerText =  document.getElementById('comment-count').innerText;
    document.getElementById('video-id').innerText=document.getElementById('video-id').innerText;

}
async function increaseupdate(isLiked) {
    const videoid = document.getElementById('video-id').innerText;
    // console.log(searchText);
    const data=[videoid,isLiked];

    try {
      const response = await fetch(`http://localhost:3500/increase?text=${encodeURIComponent(data)}`);
    //   const data = await response.json();
      

    //   initializeRankingList(data,searchText);


    //   console.log('Found videos:', data);
      // Process and display the found videos as needed
    } catch (error) {
      console.error('Error searching for videos:', error);
    }
  }
function hideDetails() {
   
    document.getElementById('details-container').style.display = 'none';
}
var isLiked = false;
function increase(){
    var x=Number(document.getElementById('likes-count').innerText)
    isLiked=!isLiked;
    // if(isLiked){
    // document.getElementById('likes-count').innerText=x-1;}
    // else{
        document.getElementById('likes-count').innerText=x+1;
    // }
    increaseupdate(isLiked);
    
    
    
    console.log(isLiked);

    
}
async function decreaseupdate() {
    const videoid = document.getElementById('video-id').innerText;
    // console.log(searchText);

    try {
      const response = await fetch(`http://localhost:3500/decrease?text=${encodeURIComponent(videoid)}`);
    //   const data = await response.json();
      

    //   initializeRankingList(data,searchText);


    //   console.log('Found videos:', data);
      // Process and display the found videos as needed
    } catch (error) {
      console.error('Error searching for videos:', error);
    }
  }
function decrease(){
    var x=Number(document.getElementById('dislikes-count').innerText)
    document.getElementById('dislikes-count').innerText=x+1;
    decreaseupdate();
}
// script.js

// Function to add a comment to the list
// async function searchsql() {
//     const userid = 123;
//     // console.log(searchText);

//     try {
//       const response = await fetch(`http://localhost:3500/searchsqlclick?text=${encodeURIComponent(userid)}`);
//       const data = await response.json();
//       recommendation(data.slice(0,10));
//       initializeHistoryList(data.slice(0,10));

//     //   initializeRankingList(data,searchText);


//       console.log('Found videos:', data);
//       // Process and display the found videos as needed
//     } catch (error) {
//       console.error('Error searching for videos:', error);
//     }
//   }
async function addcommenttodatabase(id,commentItem) {
    // const videoid = document.getElementById('video-id').innerText;
    // console.log(searchText);

    try {
        console.log(id);
      const response = await fetch(`http://localhost:3500/comment?text=${encodeURIComponent([id,commentItem])}`);
    
    } catch (error) {
      console.error('Error searching for videos:', error);
    }
  }
function addComment() {
    const commentText = document.getElementById('comment').value;
    const commentsList = document.getElementById('comments-list');
   
    const video_id=document.getElementById('video-id').innerText;
    
    console.log("comment ke liye");
    console.log(video_id);
    // Create a new list item for the comment
    const commentItem = document.createElement('li');
    commentItem.innerHTML = `
        <p>${commentText}</p>
        <button type="button" onclick="likeComment(this)">👍</button>
        <span class="like-count">0</span>
        <button type="button" onclick="dislikeComment(this)">👎</button>
        <span class="dislike-count">0</span>
    `;

    // Append the new comment to the comments list
    commentsList.appendChild(commentItem);
    addcommenttodatabase(video_id,commentText);

    // Clear the input field after adding the comment
    document.getElementById('comment').value = '';
}
function updatecomment(video) {
    const historyList = document.getElementById("history_list");
    
    // Create a new list item for the video history
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <img src="${video.thumbnail}" alt="Video Thumbnail">
        <div>
            <p>${video.title}</p>
            <p>Query: ${video.query}</p>
            <p>Searched at: ${video.searchTime}</p>
        </div>
    `;

    // Add the new list item to the history list
    historyList.appendChild(listItem);
}
// Function to handle liking a comment
function likeComment(likeButton) {
    const likeCount = likeButton.nextElementSibling;
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
}

// Function to handle disliking a comment
function dislikeComment(dislikeButton) {
    const dislikeCount = dislikeButton.nextElementSibling.nextElementSibling;
    dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
}
