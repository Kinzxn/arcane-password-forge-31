import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploader } from './FileUploader';
import { EnhancedAttackProgress } from './EnhancedAttackProgress';
import { ResultsDisplay } from './ResultsDisplay';
import { AttackMethodSelector, AttackConfig } from './AttackMethodSelector';
import { PasswordAnalyzer } from './PasswordAnalyzer';
import { ExportManager } from './ExportManager';
import { Shield, Lock, Key, Activity } from 'lucide-react';
import cyberBg from '@/assets/cyber-bg.jpg';

export interface CrackingJob {
  id: string;
  fileName: string;
  fileType: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  result?: string;
  triedPasswords: number;
  totalPasswords?: number;
  method?: string;
}

const PasswordCracker = () => {
  const [jobs, setJobs] = useState<CrackingJob[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [attackConfig, setAttackConfig] = useState<AttackConfig>({
    method: 'dictionary',
    maxLength: 12,
    minLength: 4,
    charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    useRules: true,
    threadsCount: 4,
    timeout: 3600
  });

  const addJob = (fileName: string, fileType: string) => {
    const newJob: CrackingJob = {
      id: Date.now().toString(),
      fileName,
      fileType,
      status: 'queued',
      progress: 0,
      triedPasswords: 0,
    };
    setJobs(prev => [...prev, newJob]);
    setActiveTab('progress');
    
    // Simulate job execution
    simulateJobExecution(newJob.id);
  };

  const simulateJobExecution = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'running', startTime: new Date() }
        : job
    ));

    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.id !== jobId) return job;
        
        const newProgress = Math.min(job.progress + Math.random() * 15, 100);
        const newTriedPasswords = job.triedPasswords + Math.floor(Math.random() * 1000) + 100;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          const success = Math.random() > 0.3; // 70% success rate
          return {
            ...job,
            status: success ? 'completed' : 'failed',
            progress: 100,
            endTime: new Date(),
            result: success ? 'Password123!' : undefined,
            triedPasswords: newTriedPasswords,
          };
        }
        
        return {
          ...job,
          progress: newProgress,
          triedPasswords: newTriedPasswords,
        };
      }));
    }, 200);
  };

  const stats = {
    totalJobs: jobs.length,
    completedJobs: jobs.filter(j => j.status === 'completed').length,
    successfulCracks: jobs.filter(j => j.status === 'completed' && j.result).length,
    activeJobs: jobs.filter(j => j.status === 'running').length,
  };

  return (
    <div 
      className="min-h-screen bg-background p-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(16, 20, 24, 0.95), rgba(16, 20, 24, 0.95)), url(${cyberBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10 cyber-glow">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold gradient-cyber bg-clip-text text-transparent">
              PassHunter Pro
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Advanced Password Extraction & Decryption Tool
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cyber-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold text-accent">{stats.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Successful Cracks</p>
                  <p className="text-2xl font-bold text-primary">{stats.successfulCracks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold text-warning">{stats.activeJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary-glow" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-primary-glow">
                    {stats.totalJobs > 0 
                      ? Math.round((stats.successfulCracks / stats.totalJobs) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Control Center</CardTitle>
            <CardDescription>
              Upload files and monitor cracking operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="upload" className="space-y-4">
                  <FileUploader onFileUpload={addJob} />
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                  <AttackProgress jobs={jobs} />
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                  <ResultsDisplay jobs={jobs.filter(j => j.status === 'completed' || j.status === 'failed')} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordCracker;