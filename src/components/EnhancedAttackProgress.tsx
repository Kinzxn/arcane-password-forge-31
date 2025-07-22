import { useState, useEffect } from 'react';
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
  Timer,
  Cpu,
  HardDrive,
  Thermometer,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { CrackingJob } from './PasswordCracker';

interface EnhancedAttackProgressProps {
  jobs: CrackingJob[];
  onJobAction?: (jobId: string, action: 'pause' | 'resume' | 'stop') => void;
}

const getStatusColor = (status: CrackingJob['status']) => {
  switch (status) {
    case 'queued': return 'text-muted-foreground bg-muted/20';
    case 'running': return 'text-warning bg-warning/20';
    case 'completed': return 'text-primary bg-primary/20';
    case 'failed': return 'text-destructive bg-destructive/20';
    case 'paused': return 'text-accent bg-accent/20';
    default: return 'text-muted-foreground bg-muted/20';
  }
};

const getStatusIcon = (status: CrackingJob['status']) => {
  switch (status) {
    case 'queued': return Clock;
    case 'running': return Activity;
    case 'completed': return Target;
    case 'failed': return Square;
    case 'paused': return Pause;
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

const estimateTimeRemaining = (progress: number, startTime?: Date) => {
  if (!startTime || progress === 0) return 'Unknown';
  
  const elapsed = Date.now() - startTime.getTime();
  const estimatedTotal = elapsed / (progress / 100);
  const remaining = estimatedTotal - elapsed;
  
  if (remaining < 0) return 'Almost done';
  
  const seconds = Math.floor(remaining / 1000);
  if (seconds < 60) return `${seconds}s remaining`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m remaining`;
  return `${Math.floor(seconds / 3600)}h remaining`;
};

export const EnhancedAttackProgress = ({ jobs, onJobAction }: EnhancedAttackProgressProps) => {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    temperature: 0,
    totalSpeed: 0
  });

  const activeJobs = jobs.filter(job => job.status === 'running');
  const queuedJobs = jobs.filter(job => job.status === 'queued');
  const pausedJobs = jobs.filter(job => job.status === 'paused');

  // Simulate system stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpuUsage: Math.floor(Math.random() * 40) + 40 + (activeJobs.length * 10),
        memoryUsage: Math.floor(Math.random() * 20) + 30 + (activeJobs.length * 15),
        temperature: Math.floor(Math.random() * 15) + 45 + (activeJobs.length * 5),
        totalSpeed: activeJobs.reduce((sum, job) => sum + (Math.floor(Math.random() * 50000) + 10000), 0)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeJobs.length]);

  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const handleJobAction = (jobId: string, action: 'pause' | 'resume' | 'stop') => {
    if (soundEnabled) {
      // Simulate sound effect
      console.log(`🔊 Sound: ${action} action`);
    }
    onJobAction?.(jobId, action);
  };

  return (
    <div className="space-y-6">
      {/* System Performance Dashboard */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Cpu className="h-5 w-5 animate-cyber-pulse" />
            System Performance
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8"
            >
              {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <p className="text-2xl font-mono text-primary mb-1">{systemStats.cpuUsage}%</p>
              <Progress value={systemStats.cpuUsage} className="h-1" />
            </div>
            
            <div className="p-3 rounded-lg bg-accent/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HardDrive className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <p className="text-2xl font-mono text-accent mb-1">{systemStats.memoryUsage}%</p>
              <Progress value={systemStats.memoryUsage} className="h-1" />
            </div>
            
            <div className="p-3 rounded-lg bg-warning/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Thermometer className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <p className="text-2xl font-mono text-warning mb-1">{systemStats.temperature}°C</p>
              <Progress value={(systemStats.temperature / 100) * 100} className="h-1" />
            </div>
            
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary-glow" />
                <span className="text-sm font-medium">Total Speed</span>
              </div>
              <p className="text-lg font-mono text-primary-glow">
                {systemStats.totalSpeed.toLocaleString()}/s
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              const isExpanded = expandedJobs.has(job.id);
              const currentSpeed = Math.floor(Math.random() * 50000) + 10000;
              const estimatedTotal = job.progress > 0 ? Math.floor(job.triedPasswords / (job.progress / 100)) : 0;
              
              return (
                <div key={job.id} className="p-4 rounded-lg bg-secondary/30 space-y-3 cyber-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="h-4 w-4 text-warning animate-pulse" />
                      <div>
                        <p className="font-medium font-mono">{job.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.fileType.toUpperCase()} Archive • {job.method || 'Dictionary'} Attack
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)} variant="outline">
                        {job.status.toUpperCase()}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleJobExpansion(job.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-accent">
                            {job.progress.toFixed(1)}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {estimateTimeRemaining(job.progress, job.startTime)}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={job.progress} className="h-3" />
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent to-primary/30 animate-scan rounded"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tried</p>
                        <p className="font-mono text-accent">
                          {job.triedPasswords.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Speed</p>
                        <p className="font-mono text-warning">
                          {currentSpeed.toLocaleString()}/sec
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Runtime</p>
                        <p className="font-mono">
                          {formatDuration(job.startTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Efficiency</p>
                        <p className="font-mono text-primary">
                          {Math.floor(Math.random() * 30) + 70}%
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="animate-slide-up space-y-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Keyspace</p>
                            <p className="font-mono text-accent">
                              {estimatedTotal > 0 ? estimatedTotal.toLocaleString() : 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Thread Count</p>
                            <p className="font-mono">{Math.floor(Math.random() * 8) + 1}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">GPU Accel</p>
                            <p className="font-mono text-primary">
                              {Math.random() > 0.5 ? 'Enabled' : 'Disabled'}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-2">Current Dictionary Position</p>
                          <div className="font-mono text-sm space-y-1">
                            <p>• password{Math.floor(Math.random() * 999) + 100}</p>
                            <p>• admin{Math.floor(Math.random() * 99) + 10}</p>
                            <p>• welcome{Math.floor(Math.random() * 999) + 100}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8"
                        onClick={() => handleJobAction(job.id, 'pause')}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={() => handleJobAction(job.id, 'stop')}
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 ml-auto">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Paused Jobs */}
      {pausedJobs.length > 0 && (
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Pause className="h-5 w-5" />
              Paused Jobs ({pausedJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pausedJobs.map((job) => (
              <div 
                key={job.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/10"
              >
                <div className="flex items-center gap-3">
                  <Pause className="h-4 w-4 text-accent" />
                  <div>
                    <p className="font-medium font-mono">{job.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      Paused at {job.progress.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleJobAction(job.id, 'resume')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleJobAction(job.id, 'stop')}
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            ))}
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
                    <p className="font-medium font-mono">{job.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.fileType.toUpperCase()} Archive • {job.method || 'Dictionary'} Attack
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-muted-foreground">
                    QUEUED
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Est. start: {Math.floor(Math.random() * 5) + 1}min
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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