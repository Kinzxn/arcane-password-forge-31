import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  Target, 
  Shuffle, 
  Upload, 
  Settings, 
  Clock,
  Cpu,
  HardDrive,
  CheckCircle2
} from 'lucide-react';

export interface AttackMethod {
  id: string;
  name: string;
  description: string;
  icon: typeof Zap;
  color: string;
  estimatedSpeed: string;
  effectiveness: number;
  complexity: 'Low' | 'Medium' | 'High';
}

export interface AttackConfig {
  method: string;
  maxLength: number;
  minLength: number;
  charset: string;
  customWordlist?: string;
  useRules: boolean;
  threadsCount: number;
  timeout: number;
}

const attackMethods: AttackMethod[] = [
  {
    id: 'dictionary',
    name: 'Dictionary Attack',
    description: 'Uses common passwords and word lists to crack passwords quickly',
    icon: Target,
    color: 'text-primary',
    estimatedSpeed: '50K-500K/sec',
    effectiveness: 85,
    complexity: 'Low'
  },
  {
    id: 'brute-force',
    name: 'Brute Force',
    description: 'Systematically tries all possible character combinations',
    icon: Zap,
    color: 'text-warning',
    estimatedSpeed: '10K-100K/sec',
    effectiveness: 95,
    complexity: 'High'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Attack',
    description: 'Combines dictionary words with common mutations and rules',
    icon: Shuffle,
    color: 'text-accent',
    estimatedSpeed: '25K-200K/sec',
    effectiveness: 90,
    complexity: 'Medium'
  },
  {
    id: 'custom',
    name: 'Custom Wordlist',
    description: 'Upload your own wordlist for targeted attacks',
    icon: Upload,
    color: 'text-destructive',
    estimatedSpeed: 'Variable',
    effectiveness: 75,
    complexity: 'Low'
  }
];

const charsets = {
  'lowercase': 'abcdefghijklmnopqrstuvwxyz',
  'uppercase': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'digits': '0123456789',
  'special': '!@#$%^&*()_+-=[]{}|;:,.<>?',
  'space': ' '
};

interface AttackMethodSelectorProps {
  onConfigChange: (config: AttackConfig) => void;
}

export const AttackMethodSelector = ({ onConfigChange }: AttackMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState('dictionary');
  const [config, setConfig] = useState<AttackConfig>({
    method: 'dictionary',
    maxLength: 12,
    minLength: 4,
    charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    useRules: true,
    threadsCount: 4,
    timeout: 3600
  });

  const updateConfig = (updates: Partial<AttackConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const selectedMethodData = attackMethods.find(m => m.id === selectedMethod);

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Settings className="h-5 w-5" />
            Attack Method Selection
          </CardTitle>
          <CardDescription>
            Choose the optimal attack strategy for your target
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attackMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/10 shadow-lg cyber-glow'
                    : 'border-muted hover:border-primary/50 bg-muted/20'
                }`}
                onClick={() => {
                  setSelectedMethod(method.id);
                  updateConfig({ method: method.id });
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <method.icon className={`h-6 w-6 ${method.color}`} />
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {method.complexity}
                    </Badge>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {method.description}
                </p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Speed: {method.estimatedSpeed}</span>
                  <span className={`font-mono ${method.color}`}>
                    {method.effectiveness}% effective
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <selectedMethodData?.icon className={`h-5 w-5 ${selectedMethodData?.color}`} />
            {selectedMethodData?.name} Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Length */}
          <div className="space-y-4">
            <Label className="text-primary">Password Length Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Minimum</Label>
                <div className="mt-1">
                  <Slider
                    value={[config.minLength]}
                    onValueChange={([value]) => updateConfig({ minLength: value })}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1</span>
                    <span className="font-mono text-accent">{config.minLength}</span>
                    <span>20</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Maximum</Label>
                <div className="mt-1">
                  <Slider
                    value={[config.maxLength]}
                    onValueChange={([value]) => updateConfig({ maxLength: value })}
                    max={50}
                    min={config.minLength}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{config.minLength}</span>
                    <span className="font-mono text-accent">{config.maxLength}</span>
                    <span>50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Character Set */}
          {selectedMethod === 'brute-force' && (
            <div className="space-y-3">
              <Label className="text-primary">Character Set</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(charsets).map(([key, chars]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={config.charset.includes(chars)}
                      onChange={(e) => {
                        let newCharset = config.charset;
                        if (e.target.checked) {
                          newCharset += chars;
                        } else {
                          chars.split('').forEach(char => {
                            newCharset = newCharset.replace(char, '');
                          });
                        }
                        updateConfig({ charset: [...new Set(newCharset.split(''))].join('') });
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm capitalize">{key}</span>
                  </label>
                ))}
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <Label className="text-xs text-muted-foreground">Preview:</Label>
                <p className="font-mono text-sm text-accent break-all">
                  {config.charset.slice(0, 50)}{config.charset.length > 50 ? '...' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {config.charset.length} characters
                </p>
              </div>
            </div>
          )}

          {/* Custom Wordlist */}
          {selectedMethod === 'custom' && (
            <div className="space-y-3">
              <Label className="text-primary">Custom Wordlist</Label>
              <Textarea
                placeholder="Enter passwords separated by new lines..."
                value={config.customWordlist || ''}
                onChange={(e) => updateConfig({ customWordlist: e.target.value })}
                className="font-mono text-sm"
                rows={8}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {config.customWordlist?.split('\n').filter(Boolean).length || 0} passwords
                </span>
                <Button size="sm" variant="outline">
                  <Upload className="h-3 w-3 mr-1" />
                  Upload File
                </Button>
              </div>
            </div>
          )}

          {/* Performance Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-primary flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                CPU Threads
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[config.threadsCount]}
                  onValueChange={([value]) => updateConfig({ threadsCount: value })}
                  max={16}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 thread</span>
                  <span className="font-mono text-accent">{config.threadsCount} threads</span>
                  <span>16 threads</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-primary flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeout (seconds)
              </Label>
              <Input
                type="number"
                value={config.timeout}
                onChange={(e) => updateConfig({ timeout: parseInt(e.target.value) || 3600 })}
                className="font-mono"
              />
            </div>
          </div>

          {/* Estimated Performance */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Performance Estimation
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Speed</p>
                  <p className="font-mono text-accent">{selectedMethodData?.estimatedSpeed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Complexity</p>
                  <p className="font-mono">{selectedMethodData?.complexity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-mono text-primary">{selectedMethodData?.effectiveness}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Time</p>
                  <p className="font-mono text-warning">
                    {config.maxLength <= 6 ? '< 1 hour' : config.maxLength <= 8 ? '1-24 hours' : '> 24 hours'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};