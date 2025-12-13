import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

export function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  return (
    <article
      className={cn(
        'prose prose-quoteless prose-neutral dark:prose-invert',
        // Add more prose modifiers here for customization if needed
        // e.g., prose-lg, prose-h1:text-blue-600
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
