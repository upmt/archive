# μPMT Archive

This repository serves as an archive for built versions of [μPMT (micro Phenomenology Modelling Tool)](https://github.com/upmt/upmt).

## Overview

The μPMT Archive provides a historical record of different versions of the application, allowing researchers and users to access specific builds for compatibility, research reproducibility, or comparative analysis.

## Access

Visit the archive at: **https://upmt.github.io/archive/**

## Structure

```
/
├── index.html              # Main archive browser interface
├── versions/               # Directory containing all archived versions
│   ├── index.json         # Index of all available versions
│   ├── v2.0.1/           # Version-specific directories
│   │   ├── index.html    # Application entry point
│   │   ├── assets/       # Application assets
│   │   └── metadata.json # Version metadata
│   └── ...
├── .github/workflows/     # GitHub Actions for deployment
├── scripts/              # Archival automation scripts
└── README.md
```

## Adding New Versions

### Automated (Recommended)

New versions can be automatically archived when builds are completed in the main repository using GitHub's repository dispatch feature.

### Manual

1. Clone this repository
2. Run the archiving script:
   ```bash
   VERSION="v2.0.1" COMMIT_SHA="abc123..." BUILD_DATE="2024-01-01" node scripts/archive-version.js
   ```
3. Copy the built application files to `versions/{VERSION}/`
4. Commit and push changes

## Metadata Format

Each version includes a `metadata.json` file with the following structure:

```json
{
  "name": "Version 2.0.1",
  "version": "v2.0.1",
  "commitSha": "d8c3b26c725299eaf87a8702dff5fb2e9d9ff973",
  "buildDate": "2024-09-15T10:17:23Z",
  "description": "Optional description of changes",
  "path": "v2.0.1",
  "archived": "2024-09-15T12:00:00Z"
}
```

## Related Repositories

- **Main Repository**: [upmt/upmt](https://github.com/upmt/upmt) - Source code and development
- **Live Application**: [upmt.github.io/upmt](https://upmt.github.io/upmt) - Latest version

## License

This archive follows the same licensing as the main μPMT project. See the [main repository](https://github.com/upmt/upmt) for license details.
