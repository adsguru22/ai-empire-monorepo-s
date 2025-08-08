# AI Empire - Acceptance Tests

## API Endpoints

### 1. Health Aggregator (Port 4900)

**GET /api/aggregate/health**
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "services": [
    {
      "key": "empire",
      "name": "AI Empire Core",
      "url": "http://localhost:4001",
      "healthy": false,
      "status": "offline",
      "error": "fetch failed"
    }
  ],
  "summary": {
    "total": 9,
    "healthy": 0,
    "offline": 9
  }
}
```

**POST /api/command**
```json
{
  "success": true,
  "target": "genie",
  "response": "Command executed",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**POST /api/jobs**
```json
{
  "success": true,
  "job": {
    "id": "job_123",
    "type": "wa_broadcast",
    "status": "queued"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. MCP Bridge (Port 4920)

**GET /mcp/tools**
```json
[
  {
    "server": "claude",
    "tools": [
      {
        "name": "search_web",
        "description": "Search the web for information",
        "params": {
          "query": { "type": "string", "description": "Search query" }
        }
      }
    ]
  }
]
```

**POST /mcp/call**
```json
{
  "server": "claude",
  "tool": "search_web",
  "args": { "query": "AI news" },
  "result": {
    "success": true,
    "data": "Mock result for search_web",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

## PowerShell Test Commands

### Test Health API
```powershell
iwr http://localhost:4900/api/aggregate/health | Select-Object -Expand Content
```

### Test Command API
```powershell
iwr -Method Post http://localhost:4900/api/command -ContentType 'application/json' -Body '{"target":"genie","payload":{"message":"ping"}}'
```

### Test Jobs API
```powershell
iwr -Method Post http://localhost:4900/api/jobs -ContentType 'application/json' -Body '{"type":"wa_broadcast","payload":{"segment":"all_2156","template":"offer_v1"}}'
```

### Test MCP Tools
```powershell
iwr http://localhost:4920/mcp/tools | Select-Object -Expand Content
```

### Test MCP Call
```powershell
iwr -Method Post http://localhost:4920/mcp/call -ContentType 'application/json' -Body '{"server":"claude","tool":"search_web","args":{"query":"test"}}'
```

## UI Smoke Test Steps

1. **Start Services**
   ```powershell
   .\scripts\start-all.ps1
   ```

2. **Open Command Center**
   - Navigate to `http://localhost:4200`
   - Verify neon green terminal theme loads
   - Check all 7 tabs are visible (Dashboard, Agents, Campaigns, Market, Revenue, MCP, Ops)

3. **Dashboard Tests**
   - **Service Tiles**: Should show 9 service tiles with red "OFFLINE" badges (since services aren't running)
   - **Command Bar**: 
     - Select target (genie/karim/maya/azman)
     - Enter test command: "ping"
     - Click EXECUTE button
     - Should show loading state
   - **Quick Actions**: Click any of the 4 quick action buttons
   - **Live Logs**: Should show WebSocket connection message and any command logs
   - **KPI Strip**: Should show 0 values and service count (0/9 online)

4. **Navigation Test**
   - Click each tab to verify content loads
   - Each page should show placeholder content: "coming soon..."

5. **WebSocket Test**
   - Open browser dev tools → Network → WS
   - Should see active WebSocket connection to `ws://localhost:4900/ws/logs`
   - Send a command to trigger log message

## Expected Behavior

### Service Status
- All tiles show RED/OFFLINE initially (expected - services not running)
- Auto-refresh every 3 seconds
- Response times shown in tile details

### Command Interface
- Target dropdown works
- Input field accepts commands
- EXECUTE button shows loading state
- Responses logged to console

### Real-time Logs
- WebSocket connects automatically
- Logs appear in terminal-style panel
- Auto-scroll to bottom
- Service attribution shown

### Terminal Theme
- Dark background with neon green text
- JetBrains Mono font
- Glow effects on focused inputs
- Consistent spacing and alignment

## Troubleshooting

### Port Already in Use
```powershell
.\scripts\kill-ports.ps1
```

### CORS Issues
- Ensure aggregator allows `http://localhost:4200`
- Check browser dev tools for CORS errors

### WebSocket Connection Failed
- Verify aggregator is running on port 4900
- Check firewall settings

### Services Not Starting
- Run each service individually to check for errors:
```powershell
cd apps/aggregator && pnpm dev
cd apps/mcp-bridge && pnpm dev  
cd apps/command-center && pnpm dev
```