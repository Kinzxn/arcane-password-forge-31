import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Key,
  Clock,
  Target,
  TrendingUp,
  Database
} from 'lucide-react';

interface PasswordStrength {
  score: number;
  level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
  timeTocrack: string;
  entropy: number;
}

interface PasswordAnalysis {
  length: number;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasRepeatedChars: boolean;
  hasSequentialChars: boolean;
  isDictionaryWord: boolean;
  commonPatterns: string[];
  strength: PasswordStrength;
}

const analyzePassword = (password: string): PasswordAnalysis => {
  const length = password.length;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Check for repeated characters (3+ in a row)
  const hasRepeatedChars = /(.)\1{2,}/.test(password);
  
  // Check for sequential characters
  const hasSequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i.test(password);
  
  // Simple dictionary check (common passwords)
  const commonPasswords = [
    'password', '123456', 'password123', 'admin', 'qwerty', 'letmein',
    'welcome', 'monkey', '1234567890', 'abc123', 'password1', 'iloveyou'
  ];
  const isDictionaryWord = commonPasswords.some(common => 
    password.toLowerCase().includes(common)
  );
  
  // Common patterns detection
  const commonPatterns = [];
  if (/^[a-zA-Z]+$/.test(password)) commonPatterns.push('Only letters');
  if (/^[0-9]+$/.test(password)) commonPatterns.push('Only numbers');
  if (/^(.)\1+$/.test(password)) commonPatterns.push('Repeated character');
  if (/\d{4}/.test(password)) commonPatterns.push('Contains 4-digit sequence');
  if (/(19|20)\d{2}/.test(password)) commonPatterns.push('Contains year');
  
  // Calculate entropy
  let charset = 0;
  if (hasLowercase) charset += 26;
  if (hasUppercase) charset += 26;
  if (hasNumbers) charset += 10;
  if (hasSymbols) charset += 32;
  
  const entropy = Math.log2(Math.pow(charset, length));
  
  // Calculate strength score
  let score = 0;
  if (length >= 8) score += 25;
  if (length >= 12) score += 25;
  if (hasLowercase && hasUppercase) score += 20;
  if (hasNumbers) score += 15;
  if (hasSymbols) score += 15;
  
  // Penalties
  if (hasRepeatedChars) score -= 15;
  if (hasSequentialChars) score -= 10;
  if (isDictionaryWord) score -= 25;
  if (commonPatterns.length > 0) score -= commonPatterns.length * 5;
  
  score = Math.max(0, Math.min(100, score));
  
  // Determine strength level and time to crack
  let level: PasswordStrength['level'];
  let color: string;
  let timeTocrack: string;
  
  if (score < 20) {
    level = 'Very Weak';
    color = 'text-destructive';
    timeTocrack = 'Seconds';
  } else if (score < 40) {
    level = 'Weak';
    color = 'text-orange-500';
    timeTocrack = 'Minutes';
  } else if (score < 60) {
    level = 'Fair';
    color = 'text-warning';
    timeTocrack = 'Hours';
  } else if (score < 80) {
    level = 'Good';
    color = 'text-accent';
    timeTocrack = 'Days';
  } else if (score < 95) {
    level = 'Strong';
    color = 'text-primary';
    timeTocrack = 'Years';
  } else {
    level = 'Very Strong';
    color = 'text-primary-glow';
    timeTocrack = 'Centuries';
  }
  
  return {
    length,
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSymbols,
    hasRepeatedChars,
    hasSequentialChars,
    isDictionaryWord,
    commonPatterns,
    strength: {
      score,
      level,
      color,
      timeTocrack,
      entropy: Math.round(entropy * 10) / 10
    }
  };
};

interface PasswordAnalyzerProps {
  passwords: string[];
  className?: string;
}

export const PasswordAnalyzer = ({ passwords, className = '' }: PasswordAnalyzerProps) => {
  const [analyses, setAnalyses] = useState<PasswordAnalysis[]>([]);
  const [stats, setStats] = useState({
    totalPasswords: 0,
    averageStrength: 0,
    weakPasswords: 0,
    strongPasswords: 0,
    averageLength: 0
  });

  useEffect(() => {
    if (passwords.length === 0) return;
    
    const newAnalyses = passwords.map(analyzePassword);
    setAnalyses(newAnalyses);
    
    // Calculate statistics
    const totalPasswords = newAnalyses.length;
    const averageStrength = newAnalyses.reduce((sum, a) => sum + a.strength.score, 0) / totalPasswords;
    const weakPasswords = newAnalyses.filter(a => a.strength.score < 60).length;
    const strongPasswords = newAnalyses.filter(a => a.strength.score >= 80).length;
    const averageLength = newAnalyses.reduce((sum, a) => sum + a.length, 0) / totalPasswords;
    
    setStats({
      totalPasswords,
      averageStrength: Math.round(averageStrength),
      weakPasswords,
      strongPasswords,
      averageLength: Math.round(averageLength * 10) / 10
    });
  }, [passwords]);

  if (passwords.length === 0) {
    return (
      <Card className={`cyber-border ${className}`}>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Passwords to Analyze
          </h3>
          <p className="text-muted-foreground">
            Cracked passwords will appear here for security analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold font-mono text-accent">{stats.totalPasswords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Strength</p>
                <p className="text-2xl font-bold font-mono text-primary">{stats.averageStrength}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Weak</p>
                <p className="text-2xl font-bold font-mono text-warning">{stats.weakPasswords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Strong</p>
                <p className="text-2xl font-bold font-mono text-primary">{stats.strongPasswords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Password Analysis */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Eye className="h-5 w-5" />
            Password Security Analysis
          </CardTitle>
          <CardDescription>
            Detailed analysis of cracked passwords and their security strength
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analyses.slice(0, 10).map((analysis, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-accent" />
                  <code className="px-2 py-1 rounded bg-secondary font-mono text-sm">
                    {passwords[index]}
                  </code>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${analysis.strength.color} border-current`}
                >
                  {analysis.strength.level}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Security Score</span>
                  <span className={`font-mono ${analysis.strength.color}`}>
                    {analysis.strength.score}%
                  </span>
                </div>
                <Progress value={analysis.strength.score} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {analysis.length >= 8 ? (
                    <CheckCircle className="h-3 w-3 text-primary" />
                  ) : (
                    <XCircle className="h-3 w-3 text-destructive" />
                  )}
                  <span>Length: {analysis.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  {analysis.hasUppercase && analysis.hasLowercase ? (
                    <CheckCircle className="h-3 w-3 text-primary" />
                  ) : (
                    <XCircle className="h-3 w-3 text-destructive" />
                  )}
                  <span>Mixed case</span>
                </div>
                <div className="flex items-center gap-2">
                  {analysis.hasNumbers ? (
                    <CheckCircle className="h-3 w-3 text-primary" />
                  ) : (
                    <XCircle className="h-3 w-3 text-destructive" />
                  )}
                  <span>Numbers</span>
                </div>
                <div className="flex items-center gap-2">
                  {analysis.hasSymbols ? (
                    <CheckCircle className="h-3 w-3 text-primary" />
                  ) : (
                    <XCircle className="h-3 w-3 text-destructive" />
                  )}
                  <span>Symbols</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Time to crack: <span className="font-mono">{analysis.strength.timeTocrack}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Entropy: <span className="font-mono">{analysis.strength.entropy} bits</span>
                  </span>
                </div>
              </div>

              {analysis.commonPatterns.length > 0 && (
                <div className="flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-3 w-3 text-warning mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-warning mb-1">Security Issues:</p>
                    <ul className="space-y-0.5">
                      {analysis.commonPatterns.map((pattern, i) => (
                        <li key={i} className="text-muted-foreground">• {pattern}</li>
                      ))}
                      {analysis.hasRepeatedChars && (
                        <li className="text-muted-foreground">• Contains repeated characters</li>
                      )}
                      {analysis.hasSequentialChars && (
                        <li className="text-muted-foreground">• Contains sequential characters</li>
                      )}
                      {analysis.isDictionaryWord && (
                        <li className="text-muted-foreground">• Contains common dictionary words</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}

          {analyses.length > 10 && (
            <div className="text-center p-4 text-muted-foreground">
              <p>Showing 10 of {analyses.length} passwords</p>
              <p className="text-sm">Export results to view all analyzed passwords</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};