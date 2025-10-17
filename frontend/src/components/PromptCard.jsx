import React from 'react'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
export default function PromptCard({ item }) {
  return (
    <article className="card">
      <div className="card-meta">
        <strong>{new Date(item.createdAt).toLocaleString()}</strong>
        <span className="model">{item.model}</span>
      </div>
      <div className="card-prompt">{item.prompt}</div>
      {/* <pre className="card-response">{item.response}</pre> */}
      {/* <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {item.response}
      </ReactMarkdown> */}
      {item.mode === 'text' && (
      <div className="response-container">
        <ReactMarkdown
          children={item.response}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
      )}
      {item.mode === 'image' && item.response && (
        <div className="image-container">
          <img src={item.response} alt="Generated result" />
        </div>
      )}
    </article>
  )
}