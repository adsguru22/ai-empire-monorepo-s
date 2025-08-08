import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const services = [
  { key: 'empire', url: 'http://localhost:4001', status: '/api/status' },
  { key: 'jarvis', url: 'http://localhost:7007', status: '/api/status' },
  { key: 'karim', url: 'http://localhost:8003', status: '/api/status' },
  { key: 'mafar', url: 'http://localhost:5555', status: '/api/status' },
  { key: 'taskmaster', url: 'http://localhost:6969', status: '/api/status' },
  { key: 'spark', url: 'http://localhost:3000', status: '/api/status' },
  { key: 'lmstudio', url: 'http://localhost:8080', status: '/models' },
  { key: 'ollama', url: 'http://localhost:11434', status: '/api/tags' },
  { key: 'revenue', url: 'http://localhost:9000', status: '/api/health' }
];

async function checkServiceHealth(service) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    
    const response = await fetch(`${service.url}${service.status}`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    
    return {
      ...service,
      healthy: response.ok,
      status: response.status,
      responseTime: Date.now()
    };
  } catch (error) {
    return {
      ...service,
      healthy: false,
      status: 'offline',
      error: error.message,
      responseTime: Date.now()
    };
  }
}

app.get('/api/aggregate/health', async (req, res) => {
  try {
    const healthChecks = await Promise.all(
      services.map(service => checkServiceHealth(service))
    );
    
    res.json({
      timestamp: new Date().toISOString(),
      services: healthChecks,
      summary: {
        total: services.length,
        healthy: healthChecks.filter(s => s.healthy).length,
        offline: healthChecks.filter(s => !s.healthy).length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/command', async (req, res) => {
  try {
    const { target, payload } = req.body;
    
    if (!target || !payload) {
      return res.status(400).json({ error: 'Missing target or payload' });
    }

    const response = await fetch('http://localhost:4001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, payload })
    });

    const result = await response.text();
    
    broadcastLog(`Command sent to ${target}: ${payload.message}`);
    
    res.json({ 
      success: response.ok,
      target,
      response: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const jobData = req.body;
    
    const response = await fetch('http://localhost:6969/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });

    const result = await response.json();
    
    broadcastLog(`Job submitted: ${jobData.type}`);
    
    res.json({
      success: response.ok,
      job: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/ops/start-all', async (req, res) => {
  try {
    const scriptPath = path.join(process.cwd(), '../../scripts/start-all.ps1');
    
    const child = spawn('powershell.exe', ['-File', scriptPath], {
      detached: true,
      stdio: 'ignore'
    });
    
    child.unref();
    
    broadcastLog('Starting all services...');
    
    res.json({ 
      success: true, 
      message: 'Services starting',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function broadcastLog(message) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    service: 'aggregator',
    level: 'info',
    message
  };
  
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(logEntry));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.send(JSON.stringify({
    timestamp: new Date().toISOString(),
    service: 'aggregator',
    level: 'info',
    message: 'Connected to log stream'
  }));
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const PORT = 4900;
server.listen(PORT, () => {
  console.log(`Aggregator running on http://localhost:${PORT}`);
  broadcastLog(`Aggregator started on port ${PORT}`);
});