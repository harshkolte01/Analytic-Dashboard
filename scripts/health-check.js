#!/usr/bin/env node

const http = require('http');
const https = require('https');

// Configuration
const services = [
  {
    name: 'Vanna AI Service',
    url: 'http://localhost:8000/health',
    critical: true
  },
  {
    name: 'API Backend',
    url: 'http://localhost:4000/api/chat/health',
    critical: true
  },
  {
    name: 'Web Frontend',
    url: 'http://localhost:3000',
    critical: false
  }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const timeout = 5000; // 5 seconds timeout
    
    const req = client.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(timeout);
  });
}

async function checkService(service) {
  console.log(`${colors.blue}Checking ${service.name}...${colors.reset}`);
  
  try {
    const response = await makeRequest(service.url);
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`${colors.green}✓ ${service.name} is healthy (${response.status})${colors.reset}`);
      
      // Try to parse JSON response for additional info
      try {
        const data = JSON.parse(response.data);
        if (data.status) {
          console.log(`  Status: ${data.status}`);
        }
        if (data.services) {
          console.log(`  Services: ${JSON.stringify(data.services)}`);
        }
        if (data.version) {
          console.log(`  Version: ${data.version}`);
        }
      } catch (e) {
        // Not JSON, that's okay
      }
      
      return { service: service.name, status: 'healthy', code: response.status };
    } else {
      console.log(`${colors.yellow}⚠ ${service.name} returned ${response.status}${colors.reset}`);
      return { service: service.name, status: 'warning', code: response.status };
    }
  } catch (error) {
    const isCritical = service.critical;
    const color = isCritical ? colors.red : colors.yellow;
    const symbol = isCritical ? '✗' : '⚠';
    
    console.log(`${color}${symbol} ${service.name} is not accessible${colors.reset}`);
    console.log(`  Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`  Suggestion: Make sure ${service.name} is running`);
    } else if (error.message.includes('timeout')) {
      console.log(`  Suggestion: Service may be slow to respond or overloaded`);
    }
    
    return { service: service.name, status: 'error', error: error.message };
  }
}

async function checkDatabase() {
  console.log(`${colors.blue}Checking Database Connection...${colors.reset}`);
  
  try {
    // Try to check if we can connect to the API's database endpoint
    const response = await makeRequest('http://localhost:4000/api/stats');
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`${colors.green}✓ Database connection is working${colors.reset}`);
      return { service: 'Database', status: 'healthy' };
    } else {
      console.log(`${colors.yellow}⚠ Database connection may have issues (API returned ${response.status})${colors.reset}`);
      return { service: 'Database', status: 'warning', code: response.status };
    }
  } catch (error) {
    console.log(`${colors.red}✗ Database connection failed${colors.reset}`);
    console.log(`  Error: ${error.message}`);
    console.log(`  Suggestion: Check DATABASE_URL and ensure PostgreSQL is running`);
    return { service: 'Database', status: 'error', error: error.message };
  }
}

async function main() {
  console.log(`${colors.blue}=== Analytics Dashboard Health Check ===${colors.reset}\n`);
  
  const results = [];
  
  // Check all services
  for (const service of services) {
    const result = await checkService(service);
    results.push(result);
    console.log(''); // Empty line for readability
  }
  
  // Check database
  const dbResult = await checkDatabase();
  results.push(dbResult);
  console.log('');
  
  // Summary
  console.log(`${colors.blue}=== Summary ===${colors.reset}`);
  
  const healthy = results.filter(r => r.status === 'healthy').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`${colors.green}Healthy: ${healthy}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${warnings}${colors.reset}`);
  console.log(`${colors.red}Errors: ${errors}${colors.reset}`);
  
  if (errors > 0) {
    console.log(`\n${colors.red}Critical issues detected. Please check the services above.${colors.reset}`);
    console.log(`\nCommon solutions:`);
    console.log(`1. Start Vanna service: cd apps/services/vanna && python -m uvicorn app.main:app --port 8000`);
    console.log(`2. Start API backend: cd apps/api && npm run dev`);
    console.log(`3. Start web frontend: cd apps/web && npm run dev`);
    console.log(`4. Check environment variables in .env files`);
    console.log(`5. Ensure PostgreSQL database is running`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`\n${colors.yellow}Some services have warnings. The system may still work but with limited functionality.${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.green}All systems are healthy! 🎉${colors.reset}`);
    process.exit(0);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error(`${colors.red}Uncaught error: ${error.message}${colors.reset}`);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error(`${colors.red}Unhandled rejection: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Run the health check
main();