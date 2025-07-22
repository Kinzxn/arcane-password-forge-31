import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, File, FileArchive, FileText, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileUpload: (fileName: string, fileType: string) => void;
}

const supportedFormats = [
  { ext: '.zip', icon: FileArchive, color: 'text-primary' },
  { ext: '.rar', icon: FileArchive, color: 'text-primary' },
  { ext: '.7z', icon: FileArchive, color: 'text-primary' },
  { ext: '.pdf', icon: FileText, color: 'text-accent' },
  { ext: '.docx', icon: FileText, color: 'text-accent' },
  { ext: '.xlsx', icon: FileText, color: 'text-accent' },
];

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const isSupported = supportedFormats.some(format => format.ext === fileExt);
    
    if (!isSupported) {
      toast({
        title: "Unsupported File Format",
        description: `${fileExt} files are not currently supported.`,
        variant: "destructive",
      });
      return;
    }

    const fileType = fileExt;
    onFileUpload(file.name, fileType);
    
    toast({
      title: "File Queued",
      description: `${file.name} has been added to the cracking queue.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={`cyber-border transition-all duration-300 ${
          dragActive ? 'border-primary shadow-lg cyber-glow' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10 cyber-glow">
                <Upload className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Drop your protected file here
              </h3>
              <p className="text-muted-foreground">
                Or click to browse and select a file
              </p>
            </div>
            <div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".zip,.rar,.7z,.pdf,.docx,.xlsx"
              />
              <label htmlFor="file-upload">
                <Button 
                  className="gradient-primary hover:shadow-lg transition-all duration-300"
                  asChild
                >
                  <span className="cursor-pointer">
                    <File className="h-4 w-4 mr-2" />
                    Select File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Shield className="h-5 w-5" />
            Supported Formats
          </CardTitle>
          <CardDescription>
            Currently supported file types for password extraction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {supportedFormats.map((format, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
              >
                <format.icon className={`h-4 w-4 ${format.color}`} />
                <Badge variant="outline" className="terminal-font">
                  {format.ext}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h4 className="font-semibold text-warning mb-1">Security Notice</h4>
              <p className="text-sm text-muted-foreground">
                This tool is designed for legitimate security testing, forensic analysis, and 
                authorized penetration testing only. Always ensure you have proper authorization 
                before attempting to crack passwords.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};