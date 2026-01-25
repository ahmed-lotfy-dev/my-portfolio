import { MDXRemote } from "next-mdx-remote/rsc";
import React, { Children } from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Custom components for MDX
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-medium mt-6 mb-3" {...props} />,
  p: (props: any) => {
    // If the child is an image or another block element, we use a div instead of a p
    // to avoid hydration errors (<div> cannot be a descendant of <p>)
    const hasBlockChild = Children.toArray(props.children).some(
      (child: any) => child?.type === components.img
    );

    if (hasBlockChild) {
      return <div className="my-4" {...props} />;
    }

    return <p className="leading-relaxed mb-4 text-gray-800 dark:text-gray-200" {...props} />;
  },
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
  li: (props: any) => <li {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 py-1 italic bg-gray-50 dark:bg-gray-900 my-6 rounded-r-2xl"
      {...props}
    />
  ),
  code: ({ className, children, ...props }: any) => {
    const isInline = !className?.includes("language-");
    return isInline ? (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 font-mono text-sm" {...props}>
        {children}
      </code>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: (props: any) => (
    <pre className="rounded-lg overflow-hidden my-6 bg-[#1e1e1e]" {...props} />
  ),
  img: ({ src, alt, ...props }: any) => (
    <span className="relative block w-full h-[400px] my-8 rounded-xl overflow-hidden shadow-lg border">
      <img
        src={src}
        alt={alt || "Blog image"}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {alt && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center backdrop-blur-sm block">{alt}</span>}
    </span>
  ),
  a: (props: any) => (
    <a
      className="text-primary hover:underline font-medium transition-all"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  // Handle Obsidian callouts (simplified for now)
  div: ({ className, children, ...props }: any) => {
    if (className === "callout") {
      return (
        <div className="p-4 my-6 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-800 border-blue-500 shadow-sm" {...props}>
          {children}
        </div>
      );
    }
    return <div {...props}>{children}</div>;
  },
};

interface MDXContentProps {
  content: string;
}

export default function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-pre:p-0 prose-headings:scroll-mt-20">
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        }}
      />
    </div>
  );
}
