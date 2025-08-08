# AI Empire - Windows-First Monorepo

A command center for managing AI agents, campaigns, and revenue streams.

## Quick Start (Windows)

1. Install dependencies:
```powershell
pnpm install
```

2. Start all services:
```powershell
.\scripts\start-all.ps1
```

3. Open command center:
```
http://localhost:4200
```

## Architecture

### Apps
- **command-center** (Next.js 14) - Main dashboard UI on :4200
- **aggregator** (Express) - API gateway and health monitoring on :4900  
- **mcp-bridge** (Express) - Claude MCP tool bridge on :4920

### Packages
- **service-registry** - Service discovery and mapping
- **ui** - Shared shadcn/ui components with neon terminal theme

## Services Map

| Service | Port | Purpose |
|---------|------|---------|
| AI Empire Core | 4001 | Main AI coordination |
| JARVIS Core | 7007 | AI assistant |
| KARIM AI360 | 8003 | AI agent |
| MAFAR | 5555 | AI service |
| Taskmaster | 6969 | Job queue |
| Spark | 3000 | Development |
| LM Studio | 8080 | Local models |
| Ollama | 11434 | Local models |
| Revenue Core | 9000 | Analytics |

## Development

```powershell
# Start individual services
cd apps/command-center && pnpm dev
cd apps/aggregator && pnpm dev
cd apps/mcp-bridge && pnpm dev

# Kill all ports
.\scripts\kill-ports.ps1
```

## Testing

See `TEST.md` for endpoint testing and smoke tests.