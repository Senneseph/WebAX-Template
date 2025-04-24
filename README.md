# WebAX Application Template

A template for creating WebAX applications following the WebAX architecture and standards.

## Overview

This template provides a starting point for creating WebAX applications. It includes the recommended project structure, configuration files, and examples to help you get started quickly.

## Project Structure

```
my-webax-app/
├── app/              # Interactive demo application
├── cicd/             # CI/CD configuration
├── develop/          # Development files
│   ├── src/          # Source code
│   ├── tests/        # Test files
│   └── examples/     # Example implementations
├── dist/             # Distribution files
└── docs/             # Documentation
```

## Getting Started

1. Clone this template:
   ```bash
   git clone https://github.com/webax/webax-template.git my-webax-app
   cd my-webax-app
   ```

2. Install dependencies:
   ```bash
   cd develop
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Configuration

### webax.json

The `webax.json` file in the root directory contains the WebAX-specific configuration:

```json
{
  "build": {
    "output_dir": "dist",
    "bundle": true,
    "minify": true
  },
  "development": {
    "server": {
      "port": 8080,
      "https": true
    }
  },
  "distribution": {
    "channels": ["stable", "beta", "dev"],
    "auto_update": true
  },
  "integration": {
    "comlink": {
      "expose": ["api.getData", "api.sendData"],
      "connect": ["storage-service", "auth-service"]
    }
  }
}
```

### manifest.json

The `manifest.json` file in the `dist` directory contains the PWA manifest with WebAX extensions:

```json
{
  "name": "My WebAX App",
  "short_name": "MyApp",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4285f4",
  "icons": [...],
  
  "webax": {
    "version": "1.0.0",
    "publisher": "example.com",
    "package_id": "my-webax-app",
    "dependencies": {
      "webax-lib": "^1.0.0"
    },
    "permissions": [
      "storage",
      "network",
      "notifications"
    ],
    "distribution": {
      "webtorrent": "magnet:?xt=urn:btih:...",
      "archive": "https://example.com/my-webax-app.zip",
      "repo": "https://github.com/example/my-webax-app.git"
    }
  }
}
```

## WebAX-Lib Integration

This template includes integration with WebAX-Lib, the standard library for WebAX applications:

```javascript
// Import the entire library
import WebAX from 'https://lib.webax.net/webax-lib.js';

// Import specific modules
import { storage, network } from 'https://lib.webax.net/webax-lib.js';

// Import a specific component
import { CyberEyes } from 'https://lib.webax.net/modules/cyber-eyes.js';
```

## Documentation

For detailed documentation, see:

- [WebAX Architecture](https://docs.webax.net/architecture)
- [WebAX-Lib Documentation](https://docs.webax.net/webax-lib)
- [WebAX Development Guide](https://docs.webax.net/development)

## License

MIT
