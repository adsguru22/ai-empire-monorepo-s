function App() {
    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">AI Empire Monorepo</h1>
                <div className="grid gap-4">
                    <div className="bg-card p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                        <div className="space-y-2">
                            <a href="http://localhost:4200" className="block text-primary hover:underline">
                                → Command Center (Next.js Dashboard)
                            </a>
                            <a href="http://localhost:4900/api/aggregate/health" className="block text-primary hover:underline">
                                → Aggregator API Health
                            </a>
                            <a href="http://localhost:4920/mcp/tools" className="block text-primary hover:underline">
                                → MCP Bridge Tools
                            </a>
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Run <code className="bg-muted px-2 py-1 rounded">pnpm install</code> in root</li>
                            <li>Execute <code className="bg-muted px-2 py-1 rounded">.\scripts\start-all.ps1</code></li>
                            <li>Open <code className="bg-muted px-2 py-1 rounded">http://localhost:4200</code></li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App