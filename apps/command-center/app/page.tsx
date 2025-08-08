'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Service {
  key: string
  name: string
  url: string
  healthy: boolean
  status: string | number
  responseTime: number
  error?: string
}

interface HealthResponse {
  timestamp: string
  services: Service[]
  summary: {
    total: number
    healthy: number
    offline: number
  }
}

interface LogEntry {
  timestamp: string
  service: string
  level: string
  message: string
}

export default function Dashboard() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [command, setCommand] = useState('')
  const [target, setTarget] = useState('genie')
  const [loading, setLoading] = useState(false)

  // Health polling
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('http://localhost:4900/api/aggregate/health')
        const data = await response.json()
        setHealthData(data)
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 3000)
    return () => clearInterval(interval)
  }, [])

  // WebSocket logs
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4900/ws/logs')
    
    ws.onmessage = (event) => {
      const logEntry = JSON.parse(event.data)
      setLogs(prev => [...prev.slice(-99), logEntry])
    }

    return () => ws.close()
  }, [])

  const sendCommand = async () => {
    if (!command.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4900/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          payload: { message: command }
        })
      })
      
      const result = await response.json()
      console.log('Command result:', result)
      setCommand('')
    } catch (error) {
      console.error('Command failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerJob = async (jobType: string, payload: any) => {
    try {
      const response = await fetch('http://localhost:4900/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: jobType, payload })
      })
      
      const result = await response.json()
      console.log('Job result:', result)
    } catch (error) {
      console.error('Job failed:', error)
    }
  }

  const quickActions = [
    {
      name: 'WA Broadcast',
      action: () => triggerJob('wa_broadcast', { segment: 'all_2156', template: 'offer_v1' })
    },
    {
      name: 'Market Scan',
      action: () => triggerJob('scrape_market', { markets: ['MY', 'SG', 'AU'], niches: ['slimming', 'beauty'] })
    },
    {
      name: 'Deploy Salespage',
      action: () => sendCommand() // Will use current command
    },
    {
      name: '7-Day Plan',
      action: () => triggerJob('generate_plan', { target: 'azman', message: '7-day plan RM1k→RM30k with KPI' })
    }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">AI EMPIRE</h1>
          <p className="text-muted-foreground">Command Center Dashboard</p>
        </div>

        {/* Navigation */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="mcp">MCP</TabsTrigger>
            <TabsTrigger value="ops">Ops</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Service Status */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Service Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {healthData?.services.map((service) => (
                  <Card key={service.key} className="relative">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {service.name}
                        <Badge variant={service.healthy ? 'success' : 'error'}>
                          {service.healthy ? 'ONLINE' : 'OFFLINE'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      <div>Port: {service.url.split(':').pop()}</div>
                      <div>Status: {service.status}</div>
                      {service.error && <div className="text-red-400">Error: {service.error}</div>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Command Bar */}
            <Card>
              <CardHeader>
                <CardTitle>Command Interface</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <select 
                    value={target} 
                    onChange={(e) => setTarget(e.target.value)}
                    className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                  >
                    <option value="genie">Genie</option>
                    <option value="karim">Karim</option>
                    <option value="maya">Maya</option>
                    <option value="azman">Azman</option>
                  </select>
                  <Input
                    placeholder="Enter command..."
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendCommand()}
                    className="flex-1"
                  />
                  <Button onClick={sendCommand} disabled={loading}>
                    {loading ? 'SENDING...' : 'EXECUTE'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.name}
                      onClick={action.action}
                      variant="outline"
                      className="h-12"
                    >
                      {action.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Live Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/50 rounded-md p-4 h-64 overflow-y-auto font-mono text-sm">
                  {logs.map((log, i) => (
                    <div key={i} className="mb-1">
                      <span className="text-accent">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                      <span className="text-secondary">{log.service}:</span>{' '}
                      <span className="text-foreground">{log.message}</span>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-muted-foreground">Waiting for logs...</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* KPI Strip */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">RM 0</div>
                    <div className="text-sm text-muted-foreground">Today Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Active Campaigns</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Jobs Queued</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{healthData?.summary.healthy || 0}/{healthData?.summary.total || 0}</div>
                    <div className="text-sm text-muted-foreground">Services Online</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>AI Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Agent management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Campaign creation interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market">
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Market analysis tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Revenue dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mcp">
            <Card>
              <CardHeader>
                <CardTitle>MCP Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">MCP tool interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ops">
            <Card>
              <CardHeader>
                <CardTitle>Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Operations panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}