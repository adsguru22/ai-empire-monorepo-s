import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Parse MCP_SERVERS env var: "claude:127.0.0.1:PORT;..."
const mcpServers = process.env.MCP_SERVERS?.split(';').map(server => {
  const [name, host, port] = server.split(':');
  return { name, host, port: parseInt(port) };
}) || [];

// Mock MCP tools for now - replace with actual @modelcontextprotocol/sdk
const mockTools = [
  {
    server: 'claude',
    tools: [
      {
        name: 'search_web',
        description: 'Search the web for information',
        params: {
          query: { type: 'string', description: 'Search query' }
        }
      },
      {
        name: 'analyze_text',
        description: 'Analyze text for sentiment and keywords',
        params: {
          text: { type: 'string', description: 'Text to analyze' }
        }
      }
    ]
  }
];

app.get('/mcp/tools', (req, res) => {
  try {
    res.json(mockTools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/mcp/call', async (req, res) => {
  try {
    const { server, tool, args } = req.body;
    
    if (!server || !tool || !args) {
      return res.status(400).json({ error: 'Missing server, tool, or args' });
    }

    // Mock response - replace with actual MCP SDK call
    const mockResponse = {
      server,
      tool,
      args,
      result: {
        success: true,
        data: `Mock result for ${tool} with args: ${JSON.stringify(args)}`,
        timestamp: new Date().toISOString()
      }
    };

    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4920;
app.listen(PORT, () => {
  console.log(`MCP Bridge running on http://localhost:${PORT}`);
  console.log(`Configured servers: ${mcpServers.length}`);
});