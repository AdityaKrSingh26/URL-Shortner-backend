# URL Shortener Backend

A simple URL shortening service built with Node.js, Express, and MongoDB.

## Features

- Create short URLs from long ones
- Track click analytics
- Get location info from URLs
- Auto-redirect to original URLs

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- shortid for generating IDs
- geoip-lite for location data

## API Endpoints

### Create Short URL
```
POST /api/v1/url
Body: { "url": "https://example.com" }
Response: { "id": "abc123" }
```

### Get Analytics
```
GET /api/v1/url/analytics/:shortId
Response: { "totalClicks": 5, "analytics": [...] }
```

### Get Location Info
```
GET /api/v1/ip/getInfo/:shortId
Response: { "ipAddress": "...", "location": {...} }
```

### Redirect
```
GET /:shortId
Redirects to original URL
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file**
   ```env
   DB_USERNAME=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   PORT=8000
   ```

3. **Start the server**
   ```bash
   npm start
   ```

Server runs on `http://localhost:8000`

## Usage Example

```javascript
// Create short URL
const response = await fetch('http://localhost:8000/api/v1/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});
const { id } = await response.json();
console.log(`Short URL: http://localhost:8000/${id}`);
```

## Contributing

We welcome contributions! Please follow these rules:

### Before Contributing
- Fork the repository
- Create a new branch for your feature/fix
- Check existing issues and PRs to avoid duplicates

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
