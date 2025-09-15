# Instructions for Integrating with Main Repository

## To enable automatic archiving from the main upmt repository

Add this step to the end of the deploy workflow in the main upmt repository (`.github/workflows/deploy.yml`):

```yaml
      - name: Archive Build
        if: github.ref == 'refs/heads/main'
        run: |
          curl -X POST \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Authorization: token ${{ secrets.ARCHIVE_TOKEN }}" \
            https://api.github.com/repos/upmt/archive/dispatches \
            -d '{
              "event_type": "archive-version",
              "client_payload": {
                "commit_sha": "${{ github.sha }}",
                "version": "${{ env.VERSION || github.run_number }}",
                "build_date": "${{ env.BUILD_DATE || github.event.head_commit.timestamp }}",
                "description": "${{ github.event.head_commit.message }}"
              }
            }'
```

## Required Setup

1. Create a Personal Access Token with `repo` permissions
2. Add it as `ARCHIVE_TOKEN` secret in the main upmt repository
3. The archive repository workflow will automatically:
   - Receive the dispatch event
   - Create the version directory
   - Download build artifacts (needs implementation)
   - Update the archive index
   - Deploy to GitHub Pages

## Manual Archiving

To manually archive a version:

1. Run the script:
   ```bash
   VERSION="v2.0.1" \
   COMMIT_SHA="abc123..." \
   BUILD_DATE="2024-01-01T00:00:00Z" \
   DESCRIPTION="Version description" \
   node scripts/archive-version.js
   ```

2. Copy the actual build files to `versions/{VERSION}/`
3. Replace the placeholder `index.html` with the real application
4. Commit and push changes

## Build Artifacts Structure

Each version should contain:
```
versions/v2.0.1/
├── index.html          # Main application entry point  
├── assets/            # CSS, JS, and other assets
│   ├── index.js
│   ├── index.css
│   └── ...
├── favicon.ico        # Application favicon
├── examples/          # Example files (if applicable)
└── metadata.json      # Version metadata
```