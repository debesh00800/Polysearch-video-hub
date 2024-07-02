const neo4j = require('neo4j-driver');
const mongoose = require('mongoose');

const test1 = async () => {
    const user = 'neo4j';
    const password = '12345678';
    const uri = 'bolt://127.0.0.1:7687';
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();

    try {
        const testSchema = new mongoose.Schema({
            name: String,
            description: String,
            videoInfo: {
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
                    tags: [String],
                    channelId: String,
                    publishedAt: Date,
                    liveBroadcastContent: String,
                    channelTitle: String,
                    title: String,
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
            },
        }, { collection: 'test' });

        const TestModel = mongoose.model('test', testSchema);

        // Fetch data from MongoDB
        const testData = await TestModel.find({ $text: { $search: '' } });

        // Run Neo4j queries within a transaction
        const transaction = session.beginTransaction();

        try {
            testData.slice(0,40).forEach(test => {
                const neo4jQuery = `
                    CREATE (t:Test {name: $name, description: $description, videoInfo: $videoInfo})
                    RETURN t
                `;

                const neo4jParams = {
                    name: test.name,
                    description: test.description,
                    videoInfo: test.videoInfo,
                };

                transaction
                    .run(neo4jQuery, neo4jParams)
                    .then(result => {
                        console.log('Inserted into Neo4j:', result.records[0].get('t').properties);
                    })
                    .catch(error => {
                        console.error('Error inserting into Neo4j:', error);
                    });
            });

            // Commit the transaction
            await transaction.commit();
        } catch (error) {
            // Rollback the transaction if an error occurs
            await transaction.rollback();
            throw error;
        } finally {
            // Close the Neo4j session and driver after insertion
            session.close();
            driver.close();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

test1();
