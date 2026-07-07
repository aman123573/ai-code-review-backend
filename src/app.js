require('dotenv').config();
const express = require('express');
const { getRepoInfo } = require('./services/githubService');
const { reviewCode } = require('./services/aiReviewService.js');
const { postComment } = require('./services/githubReviewService.js');
const { saveReview } = require('./services/databaseService.js');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/webhook', async (req, res) => {
    try {
        // await reviewCode("test", "test.js");
        // return;
        console.log("WEBHOOK HIT");
        const action = req.body.action;
        console.log(`Received webhook with action: ${action}`);

        if (!['opened', 'synchronize'].includes(action)) {
            return res.sendStatus(200);
        }

        const owner = req.body.repository.owner.login;
        const repo = req.body.repository.name;
        const prNumber = req.body.pull_request.number;
        const commitSha = req.body.pull_request.head.sha;

        const files = await getRepoInfo(owner, repo, prNumber);
        console.log("Files changed: ");

        const codeFiles = files.filter(file =>
            /\.(js|jsx|ts|tsx|py|java|go|cpp)$/.test(file.filename)
        );

        for (const file of codeFiles) {
            console.log("filename: ", file.filename);
            if (!file.patch) {
                console.log(`No patch available for ${file.filename} file.`);
                continue;
            }

            try {
                const review = await reviewCode(
                    file.patch,
                    file.filename
                )
                // console.log("Review: ", review)

            } catch (error) {
                console.error(error)
            }
            try {
                await postComment(
                    owner,
                    repo,
                    prNumber,
                    review
                );

                console.log("Comment posted");
            } catch (error) {
                console.error("Failed to post comment");
                console.error(error.response?.data || error.message);
            }

            try {
                await saveReview({
                    repositoryName: repo,
                    owner,
                    prNumber,
                    commitSha,
                    filename: file.filename,
                    review,
                })
            } catch (error) {
                console.error("Failed to save review");
                console.error(error);
            }

        }

        res.sendStatus(200);

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});