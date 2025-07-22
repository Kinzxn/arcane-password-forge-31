import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Globe,
  Shield,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { CrackingJob } from './PasswordCracker';
import { useToast } from '@/hooks/use-toast';

interface ExportManagerProps {
  jobs: CrackingJob[];
  className?: string;
}

interface ExportOptions {
  includePasswords: boolean;
  includeTimestamps: boolean;
  includeAnalytics: boolean;
  includeSystemInfo: boolean;
  anonymizeData: boolean;
  format: 'json' | 'csv' | 'html' | 'xml';
}

const generateReport = (jobs: CrackingJob[], options: ExportOptions) => {
  const successfulJobs = jobs.filter(job => job.status === 'completed' && job.result);
  const failedJobs = jobs.filter(job => job.status === 'failed' || (job.status === 'completed' && !job.result));
  
  const reportData = {
    summary: {
      totalJobs: jobs.length,
      successfulCracks: successfulJobs.length,
      failedAttempts: failedJobs.length,
      successRate: jobs.length > 0 ? Math.round((successfulJobs.length / jobs.length) * 100) : 0,
      reportGenerated: new Date().toISOString(),
    },
    systemInfo: options.includeSystemInfo ? {
      platform: 'PassHunter Pro v1.0',
      environment: 'Production',
      processingTime: jobs.reduce((sum, job) => {
        if (job.startTime && job.endTime) {
          return sum + (job.endTime.getTime() - job.startTime.getTime());
        }
        return sum;
      }, 0),
    } : undefined,
    jobs: jobs.map(job => ({
      id: options.anonymizeData ? `job_${jobs.indexOf(job) + 1}` : job.id,
      fileName: options.anonymizeData ? `file_${jobs.indexOf(job) + 1}${job.fileType}` : job.fileName,
      fileType: job.fileType,
      status: job.status,
      method: job.method || 'dictionary',
      password: options.includePasswords ? job.result : (job.result ? '***REDACTED***' : undefined),
      triedPasswords: job.triedPasswords,
      progress: job.progress,
      startTime: options.includeTimestamps ? job.startTime?.toISOString() : undefined,
      endTime: options.includeTimestamps ? job.endTime?.toISOString() : undefined,
      duration: job.startTime && job.endTime ? 
        Math.floor((job.endTime.getTime() - job.startTime.getTime()) / 1000) : undefined,
    })),
    analytics: options.includeAnalytics ? {
      averageTimeToSuccess: successfulJobs.length > 0 ? 
        successfulJobs.reduce((sum, job) => {
          if (job.startTime && job.endTime) {
            return sum + (job.endTime.getTime() - job.startTime.getTime());
          }
          return sum;
        }, 0) / successfulJobs.length / 1000 : 0,
      mostCommonFileType: jobs.length > 0 ? 
        jobs.reduce((a, b) => 
          jobs.filter(v => v.fileType === a.fileType).length >= 
          jobs.filter(v => v.fileType === b.fileType).length ? a : b
        ).fileType : 'none',
      averageAttempts: jobs.length > 0 ? 
        Math.round(jobs.reduce((sum, job) => sum + job.triedPasswords, 0) / jobs.length) : 0,
    } : undefined,
  };

  return reportData;
};

const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const formatAsCSV = (data: any): string => {
  const jobs = data.jobs;
  if (!jobs || jobs.length === 0) return 'No data available';
  
  const headers = Object.keys(jobs[0]).join(',');
  const rows = jobs.map((job: any) => 
    Object.values(job).map((value: any) => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value || ''
    ).join(',')
  ).join('\n');
  
  return `${headers}\n${rows}`;
};

const formatAsHTML = (data: any): string => {
  const timestamp = new Date().toLocaleString();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PassHunter Pro - Security Report</title>
    <style>
        body { font-family: monospace; background: #0f0f0f; color: #00ff88; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border: 1px solid #00ff88; padding: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: rgba(0,255,136,0.1); border: 1px solid #00ff88; padding: 15px; text-align: center; }
        .jobs-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .jobs-table th, .jobs-table td { border: 1px solid #00ff88; padding: 8px; text-align: left; }
        .jobs-table th { background: rgba(0,255,136,0.2); }
        .success { color: #00ff88; }
        .failed { color: #ff4444; }
        .redacted { color: #ffaa00; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 PASSHUNTER PRO</h1>
            <h2>Security Analysis Report</h2>
            <p>Generated: ${timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <h3>Total Jobs</h3>
                <div style="font-size: 2em;">${data.summary.totalJobs}</div>
            </div>
            <div class="stat-card">
                <h3>Successful Cracks</h3>
                <div style="font-size: 2em;" class="success">${data.summary.successfulCracks}</div>
            </div>
            <div class="stat-card">
                <h3>Failed Attempts</h3>
                <div style="font-size: 2em;" class="failed">${data.summary.failedAttempts}</div>
            </div>
            <div class="stat-card">
                <h3>Success Rate</h3>
                <div style="font-size: 2em;">${data.summary.successRate}%</div>
            </div>
        </div>
        
        <table class="jobs-table">
            <thead>
                <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Password</th>
                    <th>Attempts</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                ${data.jobs.map((job: any) => `
                    <tr>
                        <td>${job.fileName}</td>
                        <td>${job.fileType.toUpperCase()}</td>
                        <td class="${job.status === 'completed' ? 'success' : 'failed'}">${job.status.toUpperCase()}</td>
                        <td class="${job.password && job.password !== '***REDACTED***' ? 'success' : 'redacted'}">
                            ${job.password || 'N/A'}
                        </td>
                        <td>${job.triedPasswords?.toLocaleString() || 'N/A'}</td>
                        <td>${job.duration ? `${job.duration}s` : 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        ${data.analytics ? `
        <div style="margin-top: 30px; padding: 20px; border: 1px solid #00ff88;">
            <h3>📊 Analytics</h3>
            <p>Average Time to Success: ${Math.round(data.analytics.averageTimeToSuccess)}s</p>
            <p>Most Common File Type: ${data.analytics.mostCommonFileType.toUpperCase()}</p>
            <p>Average Attempts: ${data.analytics.averageAttempts?.toLocaleString()}</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center; font-size: 0.8em; color: #666;">
            <p>⚠️ This report contains sensitive security information. Handle with care.</p>
            <p>Generated by PassHunter Pro - Professional Password Analysis Tool</p>
        </div>
    </div>
</body>
</html>`;
};

export const ExportManager = ({ jobs, className = '' }: ExportManagerProps) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includePasswords: false,
    includeTimestamps: true,
    includeAnalytics: true,
    includeSystemInfo: false,
    anonymizeData: false,
    format: 'json'
  });
  
  const { toast } = useToast();
  
  const completedJobs = jobs.filter(job => job.status === 'completed' || job.status === 'failed');
  
  const handleExport = () => {
    if (completedJobs.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Complete some cracking jobs first to export results.",
        variant: "destructive",
      });
      return;
    }
    
    const reportData = generateReport(completedJobs, exportOptions);
    const timestamp = new Date().toISOString().split('T')[0];
    
    let content: string;
    let filename: string;
    let contentType: string;
    
    switch (exportOptions.format) {
      case 'csv':
        content = formatAsCSV(reportData);
        filename = `passhunter-report-${timestamp}.csv`;
        contentType = 'text/csv';
        break;
      case 'html':
        content = formatAsHTML(reportData);
        filename = `passhunter-report-${timestamp}.html`;
        contentType = 'text/html';
        break;
      case 'xml':
        content = `<?xml version="1.0" encoding="UTF-8"?>\n<report>\n${JSON.stringify(reportData, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c))}\n</report>`;
        filename = `passhunter-report-${timestamp}.xml`;
        contentType = 'application/xml';
        break;
      default:
        content = JSON.stringify(reportData, null, 2);
        filename = `passhunter-report-${timestamp}.json`;
        contentType = 'application/json';
    }
    
    downloadFile(content, filename, contentType);
    
    toast({
      title: "Report Exported Successfully",
      description: `${completedJobs.length} jobs exported as ${exportOptions.format.toUpperCase()}.`,
    });
  };
  
  const updateOption = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Available Jobs</p>
                <p className="text-2xl font-bold font-mono text-primary">{completedJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold font-mono text-accent">
                  {jobs.filter(j => j.status === 'completed' && j.result).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold font-mono text-warning">
                  {jobs.filter(j => j.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary-glow" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold font-mono text-primary-glow">
                  {completedJobs.length > 0 
                    ? Math.round((jobs.filter(j => j.result).length / completedJobs.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Configuration */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Download className="h-5 w-5" />
            Export Configuration
          </CardTitle>
          <CardDescription>
            Customize your security report export settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-primary">Export Format</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'json', label: 'JSON', icon: FileText, desc: 'Machine readable' },
                { key: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Excel compatible' },
                { key: 'html', label: 'HTML', icon: Globe, desc: 'Visual report' },
                { key: 'xml', label: 'XML', icon: FileText, desc: 'Structured data' }
              ].map(format => (
                <div
                  key={format.key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    exportOptions.format === format.key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => updateOption('format', format.key)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <format.icon className="h-4 w-4" />
                    <span className="font-medium">{format.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{format.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Include Options */}
          <div className="space-y-4">
            <Label className="text-primary">Include in Export</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="passwords"
                    checked={exportOptions.includePasswords}
                    onCheckedChange={(checked) => updateOption('includePasswords', checked)}
                  />
                  <Label htmlFor="passwords" className="cursor-pointer">
                    Cracked Passwords
                  </Label>
                  <Badge variant="outline" className="text-xs text-warning border-warning">
                    SENSITIVE
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timestamps"
                    checked={exportOptions.includeTimestamps}
                    onCheckedChange={(checked) => updateOption('includeTimestamps', checked)}
                  />
                  <Label htmlFor="timestamps" className="cursor-pointer">
                    Timestamps & Duration
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="analytics"
                    checked={exportOptions.includeAnalytics}
                    onCheckedChange={(checked) => updateOption('includeAnalytics', checked)}
                  />
                  <Label htmlFor="analytics" className="cursor-pointer">
                    Performance Analytics
                  </Label>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="systeminfo"
                    checked={exportOptions.includeSystemInfo}
                    onCheckedChange={(checked) => updateOption('includeSystemInfo', checked)}
                  />
                  <Label htmlFor="systeminfo" className="cursor-pointer">
                    System Information
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymize"
                    checked={exportOptions.anonymizeData}
                    onCheckedChange={(checked) => updateOption('anonymizeData', checked)}
                  />
                  <Label htmlFor="anonymize" className="cursor-pointer">
                    Anonymize Data
                  </Label>
                  <Badge variant="outline" className="text-xs text-accent border-accent">
                    PRIVACY
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Notice */}
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-semibold text-warning mb-2">Security & Privacy Notice</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Exported reports may contain sensitive security information</li>
                  <li>• Enable "Anonymize Data" for reports shared with third parties</li>
                  <li>• Consider excluding passwords for compliance with security policies</li>
                  <li>• Store exported files securely and delete when no longer needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleExport}
              disabled={completedJobs.length === 0}
              className="gradient-primary hover:shadow-lg transition-all duration-300"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Security Report
              {completedJobs.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {completedJobs.length} jobs
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {completedJobs.length === 0 && (
        <Card className="cyber-border">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Completed Jobs
            </h3>
            <p className="text-muted-foreground">
              Complete some password cracking operations to generate exportable reports
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};