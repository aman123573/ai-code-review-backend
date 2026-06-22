const { GoogleGenAI } = require("@google/genai")

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})


async function reviewCode(patch, filename) {
    // console.log("api key: ", process.env.GEMINI_API_KEY)
    // console.log("client: ", client)

    const prompt = `
            You are a senior software engineer.

            Review this git diff.

            File: ${filename}

            Diff:
            ${patch}

            Focus on:
            - bugs
            - security
            - performance
            - code quality

            Keep feedback concise.
            Return plain text only.
            Do not use markdown code blocks.
            `;

    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })

    return response.text
}



module.exports = {
    reviewCode
}