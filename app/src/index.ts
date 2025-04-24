/**
 * My WebAX App
 * 
 * A WebAX application following the WebAX architecture and standards.
 */

// Import WebAX-Lib modules
import { storage, network } from 'https://lib.webax.net/webax-lib.js';
import { CyberEyes, LogLevel } from 'https://lib.webax.net/modules/cyber-eyes.js';
import { Comlink } from 'https://lib.webax.net/modules/comlink.js';

// Create a logger
const logger = new CyberEyes('my-webax-app', 'main');

// Initialize the application
async function initApp() {
  try {
    logger.info('Initializing application');
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        logger.info('Service worker registered', { scope: registration.scope });
      } catch (error) {
        logger.error('Service worker registration failed', { error });
      }
    }
    
    // Initialize Comlink
    const comlink = new Comlink({
      appId: 'app://example.com/my-webax-app',
      debug: true
    });
    
    // Subscribe to messages
    comlink.subscribe('app://example.com/storage-service', (data) => {
      logger.info('Received message from storage service', { data });
    });
    
    // Load user data
    const userData = await storage.get('user-data');
    if (userData) {
      logger.info('User data loaded', { userId: userData.id });
    } else {
      logger.info('No user data found');
    }
    
    // Initialize UI
    initUI();
    
    logger.info('Application initialized');
  } catch (error) {
    logger.error('Failed to initialize application', { error });
  }
}

// Initialize the UI
function initUI() {
  logger.info('Initializing UI');
  
  // Get the app container
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    logger.error('App container not found');
    return;
  }
  
  // Create the UI
  appContainer.innerHTML = `
    <header>
      <h1>My WebAX App</h1>
    </header>
    <main>
      <p>Welcome to My WebAX App!</p>
      <button id="load-data">Load Data</button>
      <div id="data-container"></div>
    </main>
    <footer>
      <p>Powered by WebAX</p>
    </footer>
  `;
  
  // Add event listeners
  const loadDataButton = document.getElementById('load-data');
  if (loadDataButton) {
    loadDataButton.addEventListener('click', loadData);
  }
  
  logger.info('UI initialized');
}

// Load data from the API
async function loadData() {
  const dataContainer = document.getElementById('data-container');
  if (!dataContainer) {
    logger.error('Data container not found');
    return;
  }
  
  try {
    logger.info('Loading data');
    
    // Show loading indicator
    dataContainer.innerHTML = '<p>Loading...</p>';
    
    // Fetch data with offline support
    const data = await network.fetchWithFallback('https://jsonplaceholder.typicode.com/posts', {
      cacheStrategy: 'cache-first',
      offlineFallback: []
    });
    
    // Display the data
    if (data.length > 0) {
      dataContainer.innerHTML = `
        <h2>Posts</h2>
        <ul>
          ${data.slice(0, 5).map((post: any) => `
            <li>
              <h3>${post.title}</h3>
              <p>${post.body}</p>
            </li>
          `).join('')}
        </ul>
      `;
      
      // Store the data
      await storage.set('posts', data, { ttl: 3600000 }); // 1 hour
      
      logger.info('Data loaded and displayed', { count: data.length });
    } else {
      dataContainer.innerHTML = '<p>No data available</p>';
      logger.warn('No data available');
    }
  } catch (error) {
    dataContainer.innerHTML = '<p>Error loading data</p>';
    logger.error('Failed to load data', { error });
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for testing
export { initApp, initUI, loadData };
