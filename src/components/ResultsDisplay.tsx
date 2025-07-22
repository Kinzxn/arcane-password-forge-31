import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  XCircle, 
  Copy, 
  Download, 
  Search,
  Eye,
  EyeOff,
  Clock,
  FileText,
  Key,
  AlertCircle
} from 'lucide-react';
import { CrackingJob } from './PasswordCracker';
import { useToast } from '@/hooks/use-toast';

interface ResultsDisplayProps {
  jobs: CrackingJob[];
}

const formatDuration = (start?: Date, end?: Date) => {
  if (!start || !end) return 'N/A';
  const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
  
  if (duration < 60) return `${duration}s`;
  if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
  return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
};

export const ResultsDisplay = ({ jobs }: ResultsDisplayProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const { toast } = useToast();

  const filteredJobs = jobs.filter(job => 
    job.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const successfulJobs = filteredJobs.filter(job => job.status === 'completed' && job.result);
  const failedJobs = filteredJobs.filter(job => job.status === 'failed' || (job.status === 'completed' && !job.result));

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const exportResults = () => {
    const data = successfulJobs.map(job => ({
      fileName: job.fileName,
      fileType: job.fileType,
      password: job.result,
      duration: formatDuration(job.startTime, job.endTime),
      triedPasswords: job.triedPasswords,
      completedAt: job.endTime?.toISOString(),
    }));

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passhunter-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Results Exported",
      description: "Results have been downloaded as JSON file.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-2"
          >
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPasswords ? 'Hide' : 'Show'} Passwords
          </Button>
          {successfulJobs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportResults}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Results
            </Button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Successful Cracks</p>
                <p className="text-2xl font-bold text-primary">{successfulJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Failed Attempts</p>
                <p className="text-2xl font-bold text-destructive">{failedJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-accent">
                  {filteredJobs.length > 0 
                    ? Math.round((successfulJobs.length / filteredJobs.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Successful Results */}
      {successfulJobs.length > 0 && (
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              Successful Cracks ({successfulJobs.length})
            </CardTitle>
            <CardDescription>
              Passwords successfully extracted from protected files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {successfulJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium terminal-font">{job.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.fileType.toUpperCase()} Archive
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/30">
                    SUCCESS
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Password:</span>
                    <div className="flex items-center gap-2 flex-1">
                      <code className={`px-2 py-1 rounded bg-secondary terminal-font text-sm ${
                        showPasswords ? 'text-accent' : 'blur-sm hover:blur-none'
                      }`}>
                        {job.result}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(job.result!, 'Password')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-mono">{formatDuration(job.startTime, job.endTime)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Attempts</p>
                      <p className="font-mono text-primary">{job.triedPasswords.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="font-mono">
                        {job.endTime?.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Method</p>
                      <p className="font-mono text-accent">Dictionary</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Failed Results */}
      {failedJobs.length > 0 && (
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Failed Attempts ({failedJobs.length})
            </CardTitle>
            <CardDescription>
              Files where password extraction was unsuccessful
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {failedJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="font-medium terminal-font">{job.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.fileType.toUpperCase()} Archive
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-destructive border-destructive/30">
                    FAILED
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-mono">{formatDuration(job.startTime, job.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Attempts</p>
                    <p className="font-mono text-destructive">{job.triedPasswords.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reason</p>
                    <p className="font-mono text-muted-foreground">Dictionary exhausted</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card className="cyber-border">
          <CardContent className="p-8 text-center">
            {jobs.length === 0 ? (
              <>
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No Results Yet
                </h3>
                <p className="text-muted-foreground">
                  Complete some cracking jobs to see results here
                </p>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No Matching Results
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};