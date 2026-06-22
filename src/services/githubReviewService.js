const axios = require("axios");

async function postComment(
    owner,
    repo,
    prNumber,
    comment
) {
    const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
        {
            body: comment
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        }
    );
    console.log("Comment created:", response.data.html_url);
}

module.exports = {
    postComment
};