import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Activity, 
  Target, 
  Zap, 
  Pause, 
  Play, 
  Square,
  FileText,
  Timer
} from 'lucide-react';
import { CrackingJob } from './PasswordCracker';

interface AttackProgressProps {
  jobs: CrackingJob[];
}

const getStatusColor = (status: CrackingJob['status']) => {
  switch (status) {
    case 'queued': return 'text-muted-foreground bg-muted/20';
    case 'running': return 'text-warning bg-warning/20';
    case 'completed': return 'text-primary bg-primary/20';
    case 'failed': return 'text-destructive bg-destructive/20';
    default: return 'text-muted-foreground bg-muted/20';
  }
};

const getStatusIcon = (status: CrackingJob['status']) => {
  switch (status) {
    case 'queued': return Clock;
    case 'running': return Activity;
    case 'completed': return Target;
    case 'failed': return Square;
    default: return Clock;
  }
};

const formatDuration = (start?: Date, end?: Date) => {
  if (!start) return 'N/A';
  const endTime = end || new Date();
  const duration = Math.floor((endTime.getTime() - start.getTime()) / 1000);
  
  if (duration < 60) return `${duration}s`;
  if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
  return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
};

export const AttackProgress = ({ jobs }: AttackProgressProps) => {
  const activeJobs = jobs.filter(job => job.status === 'running');
  const queuedJobs = jobs.filter(job => job.status === 'queued');

  return (
    <div className="space-y-6">
      {/* Active Jobs Section */}
      {activeJobs.length > 0 && (
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Activity className="h-5 w-5 animate-pulse-glow" />
              Active Attacks ({activeJobs.length})
            </CardTitle>
            <CardDescription>
              Currently running password cracking operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeJobs.map((job) => {
              const StatusIcon = getStatusIcon(job.status);
              const estimatedTotal = job.progress > 0 ? Math.floor(job.triedPasswords / (job.progress / 100)) : 0;
              
              return (
                <div key={job.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="h-4 w-4 text-warning animate-pulse" />
                      <div>
                        <p className="font-medium terminal-font">{job.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.fileType.toUpperCase()} Archive
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)} variant="outline">
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="terminal-font text-accent">
                        {job.progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tried</p>
                      <p className="font-mono text-accent">
                        {job.triedPasswords.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Estimated Total</p>
                      <p className="font-mono text-primary">
                        {estimatedTotal > 0 ? estimatedTotal.toLocaleString() : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Speed</p>
                      <p className="font-mono text-warning">
                        {Math.floor(Math.random() * 50000) + 10000}/sec
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Runtime</p>
                      <p className="font-mono">
                        {formatDuration(job.startTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8">
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                    <Button size="sm" variant="outline" className="h-8">
                      <Square className="h-3 w-3 mr-1" />
                      Stop
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Queue Section */}
      {queuedJobs.length > 0 && (
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              Queue ({queuedJobs.length})
            </CardTitle>
            <CardDescription>
              Jobs waiting to be processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {queuedJobs.map((job, index) => (
              <div 
                key={job.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-mono">
                    {index + 1}
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium terminal-font">{job.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.fileType.toUpperCase()} Archive
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  QUEUED
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Real-time Stats */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Zap className="h-5 w-5" />
            Real-time Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-center">
              <p className="text-sm text-muted-foreground">Total Speed</p>
              <p className="text-xl font-mono text-primary">
                {Math.floor(Math.random() * 100000) + 50000}/sec
              </p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-center">
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <p className="text-xl font-mono text-accent">
                {Math.floor(Math.random() * 30) + 60}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 text-center">
              <p className="text-sm text-muted-foreground">Memory</p>
              <p className="text-xl font-mono text-warning">
                {(Math.random() * 2 + 1).toFixed(1)}GB
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-xl font-mono">
                {Math.floor(Math.random() * 12) + 1}h
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {jobs.length === 0 && (
        <Card className="cyber-border">
          <CardContent className="p-8 text-center">
            <Timer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Active Operations
            </h3>
            <p className="text-muted-foreground">
              Upload a file to start monitoring password cracking progress
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};