
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Parse incoming JSON data
app.use(express.json());

// 2. Bonus: custom middleware to log every request
app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.url}`
    );
    next();
});

// 3. Serve static HTML files from the public folder
const publicFolder = path.join(__dirname, "public");
app.use(express.static(publicFolder));

// 4. GET / - homepage
app.get("/", (req, res) => {
    const indexPath = path.join(publicFolder, "index.html");

    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Week 2 API</title>
        </head>
        <body>
            <h1>My Week 2 API!</h1>
            <p>Welcome to my Express API assignment.</p>
        </body>
        </html>
    `);
});

// 5. POST /user - accepts name and email
app.post("/user", (req, res) => {
    const { name, email } = req.body || {};

    if (
        typeof name !== "string" ||
        name.trim() === "" ||
        typeof email !== "string" ||
        email.trim() === ""
    ) {
        return res.status(400).json({
            error: "Name and email are required."
        });
    }

    return res.json({
        message: `Hello, ${name.trim()}!`,
        name: name.trim(),
        email: email.trim()
    });
});

// 6. GET /user/:id - returns a user profile
app.get("/user/:id", (req, res) => {
    const id = req.params.id;
    res.send(`User ${id} profile`);
});

// 7. Handle invalid JSON and other errors
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            error: "Invalid JSON format."
        });
    }

    console.error(err);

    return res.status(500).json({
        error: "Internal server error."
    });
});

// 8. Handle routes that do not exist
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found."
    });
});

// 9. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
