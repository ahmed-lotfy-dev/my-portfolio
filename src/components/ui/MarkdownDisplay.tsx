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
    <article className={cn("max-w-none text-foreground px-4 py-8 lg:px-6 lg:py-12", className)}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl lg:text-5xl font-extrabold text-primary mb-6 mt-12" {...props} />,
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl lg:text-4xl font-bold border-b-2 border-primary/20 pb-2 my-8 mt-12" {...props} />
          ),
          h3: ({ node, ...props }) => <h3 className="text-2xl lg:text-3xl font-bold mt-10 mb-4" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-xl lg:text-2xl font-semibold mt-8 mb-3" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-lg lg:text-xl font-semibold mt-6 mb-2" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-base lg:text-lg font-semibold mt-4 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="text-base leading-relaxed text-foreground mb-4" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-primary hover:text-primary-dark underline hover:no-underline font-medium" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="my-6 ml-6 pl-4 list-disc list-outside space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-6 ml-6 pl-4 list-decimal list-outside space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic bg-background/50 rounded-r-lg text-foreground my-6" {...props} />
          ),
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="rounded-lg shadow-md my-6" alt={props.alt || ""} {...props} />
          ),
          hr: ({ node, ...props }) => <hr className="my-10 border-t-2 border-border/70" {...props} />,
          table: ({ node, ...props }) => (
            <div className="my-8 w-full overflow-y-auto">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          tr: ({ node, ...props }) => <tr className="m-0 border-t p-0 even:bg-muted" {...props} />,
          th: ({ node, ...props }) => (
            <th className="border border-border px-4 py-3 text-left font-bold bg-secondary/30 [[align=center]]:text-center [[align=right]]:text-right" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-3 text-left [[align=center]]:text-center [[align=right]]:text-right" {...props} />
          ),
          strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
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
              <code className="relative rounded-md bg-secondary/60 px-2 py-1 font-mono text-sm font-medium text-primary" {...rest}>
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
