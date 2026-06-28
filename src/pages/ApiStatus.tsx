import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Activity, CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ApiStatus = () => {
  const [lastCheck, setLastCheck] = useState(new Date());

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-none border-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to Home</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold uppercase tracking-tighter italic">RoboLab // Status</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last Scan: {lastCheck.toLocaleTimeString()}
          </div>
        </header>

        <main className="space-y-6">
          <Card className="rounded-none border-2 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold uppercase tracking-tight">Global System Status</h2>
                  <p className="text-sm text-muted-foreground uppercase">All systems operational within normal parameters.</p>
                </div>
                <Badge className="bg-green-600 hover:bg-green-600 rounded-none px-4 py-1 text-sm uppercase">Operational</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">External Subsystems</h3>

              <Card className="rounded-none border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-bold uppercase text-sm tracking-tight">Spotify Web API</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-muted-foreground">Latency: 42ms</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-bold uppercase text-sm tracking-tight">YouTube Data API v3</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-muted-foreground">Latency: 89ms</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-bold uppercase text-sm tracking-tight">RoboLab Discovery Service</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-muted-foreground">Latency: 12ms</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Incidents</h3>
              <div className="border-2 border-dashed p-12 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                <CheckCircle2 className="h-8 w-8 opacity-20" />
                <p className="text-[10px] uppercase font-bold tracking-widest">No incidents reported in the last 72 hours</p>
              </div>
            </div>
          </div>

          <footer className="pt-12 pb-8 text-center border-t border-dashed">
            <div className="flex flex-col items-center gap-4">
              <Button
                variant="outline"
                className="rounded-none border-2 uppercase text-[10px] font-bold"
                onClick={() => setLastCheck(new Date())}
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Refresh Telemetry
              </Button>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                RoboLab Systems // API Monitoring Node: US-EAST-1
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ApiStatus;
