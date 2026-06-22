const axios = require('axios');

async function getRepoInfo(owner, repo, pullNumber) {
    const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        }
    )
    return res.data;
}

module.exports = {
    getRepoInfo
}