import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-primary mb-6 mt-2 font-mono tracking-tight">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mt-10 mb-4 pb-2 border-b border-base-content/10 text-base-content">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold mt-7 mb-3 text-primary/90">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-sm font-semibold mt-5 mb-2 text-base-content/80 uppercase tracking-wide">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-7 text-base-content/80 text-[0.95rem]">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-base-content/80 text-[0.95rem] leading-7">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-base-content">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-base-content/70">{children}</em>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-2"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/50 pl-4 my-5 text-base-content/60 italic bg-base-200/50 py-2 pr-4 rounded-r-lg">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-base-content/10 my-8" />,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6 rounded-lg border border-base-content/10">
            <table className="table table-sm w-full">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-base-200 text-base-content/70 text-xs uppercase">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left font-semibold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-base-content/80 text-sm">{children}</td>
        ),
        tr: ({ children }) => (
          <tr className="border-t border-base-content/10 hover:bg-base-200/40 transition-colors">
            {children}
          </tr>
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="!rounded-xl !mb-5 !text-sm"
                customStyle={{ borderRadius: "0.75rem", marginBottom: "1.25rem" }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          }
          if (!inline && !match && String(children).includes("\n")) {
            // Fenced code block with no language tag
            return (
              <SyntaxHighlighter
                style={oneDark}
                language="text"
                PreTag="div"
                customStyle={{ borderRadius: "0.75rem", marginBottom: "1.25rem" }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          }
          return (
            <code
              className="bg-base-300 text-primary px-1.5 py-0.5 rounded text-[0.85em] font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
