const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();
const exeFile = path.join(__dirname, '108.exe'); // Correct EXE Path

// Function to download EXE from GitHub
const downloadFile = (url, dest, callback) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close(callback);
        });
    }).on('error', (err) => {
        fs.unlink(dest, () => {});
        console.error(`Download error: ${err.message}`);
        callback(err);
    });
};

// Route to download and execute EXE
app.get('/runExe', (req, res) => {
    const exeUrl = "https://raw.githubusercontent.com/deepakrummy/fenny/main/108.exe"; // Correct URL

    // Download EXE first
    downloadFile(exeUrl, exeFile, (err) => {
        if (err) {
            res.status(500).send(`Download Failed: ${err.message}`);
            return;
        }

        // Execute the downloaded EXE file
        exec(exeFile, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution Error: ${error.message}`);
                res.status(500).send(`Execution Error: ${error.message}`);
                return;
            }
            res.send(`Output: ${stdout}`);
        });
    });
});

// Fix Incorrect "/" Route (Now Returns a Simple Message)
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Export app (for Vercel compatibility)
module.exports = app;
