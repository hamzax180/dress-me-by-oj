# Clean URLs

## Overview
The website uses "Clean URLs" to provide a more professional and user-friendly appearance. This means that `.html` extensions are removed from the URL bar (e.g., `example.com/about` instead of `example.com/about.html`).

## Implementation Details
- **Configuration:** This is handled by Vercel's configuration file (`vercel.json`) located in the `infra` directory.
    - `"cleanUrls": true`: Tells Vercel to serve the HTML file even if the extension is missing in the request.
    - `"trailingSlash": false`: Ensures URLs do not end with a slash, maintaining consistency.
- **Frontend:** All internal links in the HTML files (navigation, footer, buttons) have been updated to point to the clean paths (e.g., `href="about"`).

## Usage
When creating new pages:
1.  Create the `.html` file as usual (e.g., `new-page.html`).
2.  Link to it without the extension: `<a href="new-page">New Page</a>`.
