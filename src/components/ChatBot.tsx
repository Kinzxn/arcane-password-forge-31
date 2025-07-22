import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const ChatBot = ({ isMinimized = false, onToggleMinimize }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your cybersecurity assistant. I can help you with password cracking techniques, tool usage, and security methodologies. What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Password cracking methodology
    if (lowerMessage.includes('dictionary') || lowerMessage.includes('wordlist')) {
      return 'Dictionary attacks use precompiled lists of common passwords. They\'re effective because users often choose predictable passwords. Best wordlists include rockyou.txt, SecLists, and custom lists based on target reconnaissance.';
    }
    
    if (lowerMessage.includes('brute force')) {
      return 'Brute force attacks try every possible combination. While thorough, they\'re time-intensive. Focus on shorter lengths first (4-8 chars) and use character sets based on password policy analysis.';
    }
    
    if (lowerMessage.includes('rainbow table')) {
      return 'Rainbow tables are precomputed hash lookups that trade storage for computation time. They\'re effective against unsalted hashes but useless against properly salted passwords.';
    }
    
    if (lowerMessage.includes('mask attack') || lowerMessage.includes('hybrid')) {
      return 'Mask attacks use patterns like "?u?l?l?l?d?d?d" (Upper+3lower+3digits). Hybrid attacks combine wordlists with rules. Both are more efficient than pure brute force.';
    }
    
    // Tool usage
    if (lowerMessage.includes('hashcat')) {
      return 'Hashcat is the gold standard for password recovery. Use -m for hash types, -a for attack modes, and --force for compatibility. Example: hashcat -m 1000 -a 0 hashes.txt wordlist.txt';
    }
    
    if (lowerMessage.includes('john') || lowerMessage.includes('ripper')) {
      return 'John the Ripper excels at format detection and rule-based attacks. Use --format= for specific types, --rules for mangling, and --incremental for brute force modes.';
    }
    
    if (lowerMessage.includes('hydra')) {
      return 'Hydra performs online password attacks against services. Syntax: hydra -l username -P passwordlist target service. Always respect rate limits to avoid detection.';
    }
    
    // Security concepts
    if (lowerMessage.includes('salt') || lowerMessage.includes('salted')) {
      return 'Salts are random values added to passwords before hashing. They prevent rainbow table attacks and ensure identical passwords have different hashes. Always use unique salts per password.';
    }
    
    if (lowerMessage.includes('hash') || lowerMessage.includes('hashing')) {
      return 'Common hash types: MD5 (weak), SHA-1 (deprecated), SHA-256/512 (strong), bcrypt/scrypt/Argon2 (recommended for passwords). Always identify hash type before attacking.';
    }
    
    // File formats
    if (lowerMessage.includes('zip') || lowerMessage.includes('archive')) {
      return 'ZIP passwords can be cracked using zip2john + John the Ripper or hashcat mode 13600. Legacy ZIP encryption is weak; newer AES encryption is much stronger.';
    }
    
    if (lowerMessage.includes('pdf')) {
      return 'PDF passwords vary by version. Use pdf2john for extraction, then attack with John or hashcat. Newer PDFs use stronger encryption (AES-256) than older versions.';
    }
    
    if (lowerMessage.includes('office') || lowerMessage.includes('word') || lowerMessage.includes('excel')) {
      return 'Office documents use strong encryption in newer versions. Extract hashes with office2john, then use hashcat modes 9400-9800 depending on Office version and encryption type.';
    }
    
    // Performance and optimization
    if (lowerMessage.includes('gpu') || lowerMessage.includes('cuda') || lowerMessage.includes('opencl')) {
      return 'GPU acceleration dramatically speeds up cracking. NVIDIA (CUDA) and AMD (OpenCL) both work well with hashcat. A single high-end GPU can outperform dozens of CPU cores.';
    }
    
    if (lowerMessage.includes('speed') || lowerMessage.includes('performance')) {
      return 'Optimize cracking speed by: 1) Using GPU acceleration, 2) Choosing efficient attack modes, 3) Prioritizing likely candidates, 4) Using appropriate wordlists, 5) Leveraging multiple GPUs.';
    }
    
    // Ethics and legality
    if (lowerMessage.includes('legal') || lowerMessage.includes('ethics')) {
      return 'Only crack passwords you own or have explicit authorization to test. Use tools for legitimate security testing, research, or recovery of your own forgotten passwords. Always follow applicable laws.';
    }
    
    // Troubleshooting
    if (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('not working')) {
      return 'Common issues: 1) Wrong hash format identification, 2) Incorrect command syntax, 3) Missing dependencies, 4) Hardware compatibility problems. Check error messages and verify hash format first.';
    }
    
    // Default responses
    const defaultResponses = [
      'I specialize in cybersecurity and password cracking techniques. Try asking about dictionary attacks, brute force methods, hashcat usage, or specific file formats like ZIP or PDF.',
      'I can help with various password cracking topics including tools (hashcat, John the Ripper), attack methods (dictionary, brute force, hybrid), and security concepts. What interests you?',
      'Feel free to ask about password security, hash types, cracking methodologies, or tool recommendations. I\'m here to assist with your cybersecurity research.',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(inputValue),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <Button
        onClick={onToggleMinimize}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 h-96 cyber-border bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm">Cyber Assistant</CardTitle>
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleMinimize}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full pb-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="p-1 rounded-full bg-primary/10 mt-1">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg p-3 text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                
                {message.type === 'user' && (
                  <div className="p-1 rounded-full bg-muted mt-1">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-primary/10">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <div className="flex gap-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about password cracking..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;