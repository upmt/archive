#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

/**
 * Archive a new version of the μPMT application
 * This script downloads a built version and adds it to the archive
 */

const COMMIT_SHA = process.env.COMMIT_SHA;
const VERSION = process.env.VERSION || new Date().toISOString().split('T')[0];
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString();
const DESCRIPTION = process.env.DESCRIPTION || '';

console.log('Archiving version:', VERSION);
console.log('Commit SHA:', COMMIT_SHA);
console.log('Build Date:', BUILD_DATE);

async function downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function archiveVersion() {
    try {
        const versionPath = `versions/${VERSION}`;
        const versionsDir = path.join(process.cwd(), versionPath);
        
        // Create version directory
        if (!fs.existsSync(versionsDir)) {
            fs.mkdirSync(versionsDir, { recursive: true });
        }

        // For now, we'll create a placeholder that can be manually populated
        // In a real implementation, this would download from GitHub Pages or artifacts
        const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>μPMT v${VERSION}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>μPMT Version ${VERSION}</h1>
        <p>This archived version was built on ${new Date(BUILD_DATE).toLocaleDateString()}</p>
        ${DESCRIPTION ? `<p>${DESCRIPTION}</p>` : ''}
        <p>
            <strong>Note:</strong> This is a placeholder. In a production setup, 
            the actual built application would be archived here.
        </p>
        <div>
            <a href="https://upmt.github.io/upmt/" class="btn">Go to Latest Version</a>
            <a href="../" class="btn">Back to Archive</a>
        </div>
        <p style="margin-top: 30px; color: #666; font-size: 0.9rem;">
            Commit: <a href="https://github.com/upmt/upmt/commit/${COMMIT_SHA}">${COMMIT_SHA?.substring(0, 8) || 'unknown'}</a>
        </p>
    </div>
</body>
</html>`;

        // Write the index.html file
        fs.writeFileSync(path.join(versionsDir, 'index.html'), indexContent);

        // Create metadata.json
        const metadata = {
            name: `Version ${VERSION}`,
            version: VERSION,
            commitSha: COMMIT_SHA || 'unknown',
            buildDate: BUILD_DATE,
            description: DESCRIPTION,
            path: VERSION,
            archived: new Date().toISOString()
        };

        fs.writeFileSync(path.join(versionsDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

        // Update the versions index
        const indexPath = path.join(process.cwd(), 'versions', 'index.json');
        let versions = [];
        
        if (fs.existsSync(indexPath)) {
            try {
                const indexContent = fs.readFileSync(indexPath, 'utf8');
                versions = JSON.parse(indexContent);
            } catch (e) {
                console.log('Could not parse existing index.json, creating new one');
                versions = [];
            }
        }

        // Add this version if it doesn't already exist
        const existingIndex = versions.findIndex(v => v.version === VERSION);
        if (existingIndex !== -1) {
            versions[existingIndex] = metadata;
        } else {
            versions.push(metadata);
        }

        // Sort versions by build date, newest first
        versions.sort((a, b) => new Date(b.buildDate) - new Date(a.buildDate));

        fs.writeFileSync(indexPath, JSON.stringify(versions, null, 2));

        console.log(`Successfully archived version ${VERSION}`);
        
        // If running in GitHub Actions, commit the changes
        if (process.env.GITHUB_ACTIONS) {
            try {
                execSync('git config --global user.name "GitHub Actions"');
                execSync('git config --global user.email "actions@github.com"');
                execSync('git add .');
                execSync(`git commit -m "Archive version ${VERSION}"`);
                execSync('git push');
                console.log('Changes committed and pushed');
            } catch (e) {
                console.log('Could not commit changes:', e.message);
            }
        }

    } catch (error) {
        console.error('Error archiving version:', error);
        process.exit(1);
    }
}

// Only run if called directly (not imported)
if (require.main === module) {
    if (!VERSION) {
        console.error('VERSION environment variable is required');
        process.exit(1);
    }
    archiveVersion();
}

module.exports = { archiveVersion };