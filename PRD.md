# AI Empire Monorepo - Product Requirements Document

An AI Empire command center built as a Windows-first monorepo with microservices architecture and unified dashboard for managing AI agents, campaigns, and revenue streams.

**Experience Qualities**: 
1. **Terminal-like** - Neon green aesthetic that feels like a command center interface
2. **Real-time** - Live updates and instant feedback across all operations
3. **Powerful** - Comprehensive control over multiple AI services and workflows

**Complexity Level**: Complex Application (advanced functionality, multiple services)
- Requires coordination between multiple microservices, real-time communication, and sophisticated state management across different domains (agents, campaigns, revenue, operations).

## Essential Features

### Service Registry & Health Monitoring
- **Functionality**: Central registry tracking 9 microservices with health status
- **Purpose**: Single source of truth for service discovery and monitoring
- **Trigger**: Auto-polling every 3 seconds from dashboard
- **Progression**: Load service-map.json → Poll status endpoints → Display health tiles
- **Success criteria**: All services show green/red status with response times

### Command Dispatch System
- **Functionality**: Route commands to specific AI agents (karim, maya, azman, genie)
- **Purpose**: Unified interface for AI agent communication
- **Trigger**: Command bar input or quick action buttons
- **Progression**: Select target → Enter command → POST to aggregator → Forward to service → Show response
- **Success criteria**: Commands reach correct agents and return structured responses

### Job Queue Management
- **Functionality**: Trigger background jobs (WA broadcast, market scraping)
- **Purpose**: Orchestrate long-running automation tasks
- **Trigger**: Quick action buttons or campaign forms
- **Progression**: Select job type → Configure parameters → Submit to taskmaster → Monitor progress
- **Success criteria**: Jobs queue successfully and show progress updates

### MCP Tool Integration
- **Functionality**: Discover and execute Claude MCP tools via HTTP bridge
- **Purpose**: Extend capabilities through Model Context Protocol
- **Trigger**: MCP page tool selection
- **Progression**: List available tools → Select tool → Input parameters → Execute → Display results
- **Success criteria**: Tools execute and return structured JSON responses

### Live Logging System
- **Functionality**: Real-time log streaming from all services
- **Purpose**: Operational visibility and debugging
- **Trigger**: WebSocket connection on dashboard load
- **Progression**: Connect to WS → Receive log events → Display in scrolling panel
- **Success criteria**: Logs appear in real-time with service attribution

## Edge Case Handling
- **Service Offline**: Display red status tile with last-seen timestamp
- **Network Timeout**: Show warning icon with retry button after 2.5s
- **Invalid Commands**: Return error message in command response area
- **Port Conflicts**: Kill existing processes before starting new ones
- **Missing Dependencies**: Clear error messages with installation instructions

## Design Direction
The interface should feel like a high-tech command center with neon green terminal aesthetics - serious, focused, and powerful while maintaining clean readability for extended use sessions.

## Color Selection
Custom palette using neon green terminal theme with dark backgrounds.

- **Primary Color**: Neon Green (oklch(0.8 0.2 142)) - Commands, active states, success indicators
- **Secondary Colors**: Dark Gray (oklch(0.2 0 0)) - Panels, Dark Green (oklch(0.3 0.15 142)) - Hover states
- **Accent Color**: Bright Cyan (oklch(0.7 0.25 200)) - Alerts, notifications, critical actions
- **Foreground/Background Pairings**: 
  - Background (oklch(0.1 0 0)): Bright Green text (oklch(0.85 0.2 142)) - Ratio 12.8:1 ✓
  - Card (oklch(0.15 0 0)): Green text (oklch(0.8 0.2 142)) - Ratio 10.2:1 ✓
  - Primary (oklch(0.8 0.2 142)): Black text (oklch(0.1 0 0)) - Ratio 12.8:1 ✓

## Font Selection
Use JetBrains Mono for that authentic terminal feel with excellent code readability and consistent character width that reinforces the command center aesthetic.

- **Typographic Hierarchy**: 
  - H1 (Page Titles): JetBrains Mono Bold/24px/tight spacing
  - H2 (Section Headers): JetBrains Mono Medium/18px/normal spacing  
  - Body (Interface Text): JetBrains Mono Regular/14px/relaxed spacing
  - Code (Commands/Logs): JetBrains Mono Regular/12px/monospace spacing

## Animations
Subtle terminal-style animations that reinforce the command center feel - quick state transitions, typewriter effects for logs, and pulsing indicators for active states without being distracting.

- **Purposeful Meaning**: Fast, precise movements that feel responsive and technical
- **Hierarchy of Movement**: Status indicators pulse, command execution shows progress, logs scroll smoothly

## Component Selection
- **Components**: Cards for service tiles, Tabs for navigation, Forms for commands/jobs, Badge for status indicators, Button variants for actions, Table for data display, ScrollArea for logs
- **Customizations**: Terminal-style input components, neon glow effects on focus states, custom status indicators with pulse animations
- **States**: Buttons show loading spinners, inputs have neon focus rings, tiles pulse when updating
- **Icon Selection**: Phosphor icons for technical/command center feel - Terminal, Broadcast, Scan, Deploy icons
- **Spacing**: Consistent 4/8/16px spacing using Tailwind scale for clean alignment
- **Mobile**: Responsive breakpoints with collapsible sidebar, stacked tiles on mobile, simplified command interface for touch