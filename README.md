## Bulk URL Processing (CSV Upload)

Upload a CSV file to create short URLs in bulk. The CSV may contain either:
- A single column of URLs with optional header `url`
- Multiple columns where the first column is treated as the URL

### Endpoints

- POST `/api/v1/url/bulk/upload`
  - Form-data: field `file` containing the CSV file
  - Returns: `{ jobId, status }` with `202 Accepted`

- GET `/api/v1/url/bulk/status/:jobId`
  - Returns job progress and results:
  - Example response:

```json
{
  "id": "abc123",
  "status": "completed",
  "createdAt": 1710000000000,
  "total": 3,
  "processed": 3,
  "succeeded": 3,
  "failed": 0,
  "results": [
    { "url": "https://example.com", "id": "Q1wErT" }
  ],
  "errors": []
}
```

### Notes
- Max file size: 5 MB
- Processing is in-memory and job status is ephemeral. For production, back job state with Redis or a database and consider rate limiting.
- URLs without `http://` or `https://` will be stored as-is; redirection handler prefixes `http://` when redirecting.
# URL Shortener Backend

A simple URL shortening service built with Node.js, Express, and MongoDB.

## Features

- Create short URLs from long ones
- Track click analytics
- Get location info from URLs
- Auto-redirect to original URLs
- URL expiration functionality
- Bulk URL processing via CSV upload

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- shortid for generating IDs
- geoip-lite for location data

## API Endpoints

### Create Short URL
```
POST /api/v1/url
Body: { "url": "https://example.com", "expiresInDays": 30 }
Response: { "id": "abc123", "expirationDate": "2025-11-28T00:00:00.000Z" }
```
- `expiresInDays` (optional): Number of days before the URL expires. If not provided, URL is permanent.

### Get Analytics
```
GET /api/v1/url/analytics/:shortId
Response: { 
  "totalClicks": 5, 
  "analytics": [...],
  "expirationDate": "2025-11-28T00:00:00.000Z",
  "isExpired": false
}
```

### Extend URL Expiration
```
PATCH /api/v1/url/expiration/:shortId
Body: { "additionalDays": 30 }
Response: { "message": "Expiration date extended successfully", "expirationDate": "..." }
```

### Get Location Info
```
GET /api/v1/ip/getInfo/:shortId
Response: { "ipAddress": "...", "location": {...} }
```

### Redirect
```
GET /:shortId
Redirects to original URL (returns 410 if expired)
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file**
   ```env
   MONGO_URI = your mongo uri
   PORT=8000
   ```

3. **Start the server**
   ```bash
   npm start
   ```

Server runs on `http://localhost:8000`

## Usage Example

```javascript
// Create short URL with expiration (30 days)
const response = await fetch('http://localhost:8000/api/v1/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://example.com',
    expiresInDays: 30 
  })
});
const { id, expirationDate } = await response.json();
console.log(`Short URL: http://localhost:8000/${id}`);
console.log(`Expires on: ${expirationDate}`);

// Extend expiration
const extendResponse = await fetch(`http://localhost:8000/api/v1/url/expiration/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ additionalDays: 30 })
});
const result = await extendResponse.json();
console.log(result);
```

## Contributing

We welcome contributions! Please follow these rules:

### Before Contributing
- Fork the repository
- Create a new branch for your feature/fix
- Check existing issues and PRs to avoid duplicates
- Raise your PR on DEV branch

### Code Standards
- Use ES6+ syntax and modules
- Follow existing code formatting
- Add comments for complex logic
- Keep functions small and focused

### Pull Request Process
1. Create a descriptive branch name (`feature/add-auth` or `fix/redirect-bug`)
2. Make your changes with clear, concise commits
3. Test your changes locally
4. Update documentation if needed
5. Submit PR with detailed description

### Commit Guidelines
- Use present tense ("Add feature" not "Added feature")
- Keep commits focused on single changes
- Reference issues when applicable (#123)

### What to Contribute
- Bug fixes
- New features (discuss in issues first)
- Documentation improvements
- Performance optimizations
- Test coverage

Please be respectful and constructive in all interactions!
