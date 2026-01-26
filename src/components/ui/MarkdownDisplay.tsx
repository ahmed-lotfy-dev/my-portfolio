import ReactMarkdown, { Components } from 'react-markdown';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

export function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  return (
    <article className={cn(
      "prose prose-lg dark:prose-invert max-w-none",
      "prose-headings:text-black prose-p:text-black prose-strong:text-black prose-li:text-black",
      "dark:prose-headings:text-white dark:prose-p:text-gray-100 dark:prose-strong:text-white dark:prose-li:text-gray-100",
      className
    )}>
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...rest }: {
            node?: any;
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
            [key: string]: any;
          }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...rest}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="relative rounded-md bg-muted px-2 py-1 font-mono text-sm font-medium text-primary dark:text-primary-foreground" {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
