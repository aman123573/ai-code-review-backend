const pool = require('../db/db.js');

async function saveReview({
    repositoryName,
    owner,
    prNumber,
    commitSha,
    filename,
    review,
}) {
    console.log("Saving review to database:", {
        repositoryName,
        owner,
        prNumber,
        commitSha,
        filename,
        review,
    });

    await pool.query(
        `
      INSERT INTO reviews
      (repository_name, owner, pr_number, commit_sha, filename, review)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
        [repositoryName, owner, prNumber, commitSha, filename, review]
    );
}

module.exports = { saveReview }