const express = require('express');
const neo4j = require('neo4j-driver');

const app = express();
const port = 3002;

const neo4jUri = 'neo4j+s://d11f3ffe.databases.neo4j.io';  // Replace with your Neo4j Aura URI
const neo4jUser = 'neo4j';
const neo4jPassword = 'S2dkmoW4eI0Pe_pk86Td_0SIg3WHlrrLNpyXU93buW0';

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));
const session = driver.session();

console.log("ayein 1");
app.get('/recommend', async (req, res) => {
    const videoId = req.query.text;
    try {
        console.log("ayein");
        const result = await session.run(
            `
            MATCH (sourceVideo:Video {videoId: $videoId})-[:HAS_TAG]->(tag:Tag)<-[:HAS_TAG]-(recommendedVideo:Video)
            WHERE sourceVideo <> recommendedVideo
            WITH recommendedVideo, COUNT(tag) AS sharedTags
            ORDER BY sharedTags DESC
            LIMIT 10
            RETURN recommendedVideo.videoId, recommendedVideo.title
            `,
            { videoId: '7DPwZ-Qdhe8' }  // Assuming the video ID is extracted correctly from the URL
        );

        const recommendations = result.records.map(record => record.get('recommended').properties);
        res.json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
