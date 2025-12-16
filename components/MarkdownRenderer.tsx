import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // A very basic parser to handle code blocks and paragraphs.
  // In a real app, use react-markdown. This is a lightweight substitute to avoid dependencies.
  
  const segments = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed">
      {segments.map((segment, index) => {
        if (segment.startsWith('```')) {
          // Extract language and code
          const firstLineBreak = segment.indexOf('\n');
          const language = segment.slice(3, firstLineBreak).trim();
          const code = segment.slice(firstLineBreak + 1, -3);

          return (
            <div key={index} className="my-4 rounded-lg overflow-hidden border border-slate-700 shadow-sm">
              <div className="bg-slate-800 text-slate-300 px-4 py-1 text-xs font-mono flex justify-between items-center">
                <span>{language || 'code'}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 m-0 overflow-x-auto text-sm font-mono">
                <code>{code}</code>
              </pre>
            </div>
          );
        } else {
          // Handle paragraphs and bold text
          // Split by double newlines for paragraphs
          const paragraphs = segment.split('\n\n').filter(p => p.trim());
          return (
            <React.Fragment key={index}>
              {paragraphs.map((p, pIndex) => {
                  // Basic Bold processing **text**
                  const parts = p.split(/(\*\*.*?\*\*)/g);
                  return (
                      <p key={pIndex} className="mb-3">
                          {parts.map((part, partIndex) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                              }
                              // Basic inline code `text`
                              const inlineCodeParts = part.split(/(`.*?`)/g);
                              return (
                                <span key={partIndex}>
                                  {inlineCodeParts.map((icPart, icIndex) => {
                                      if (icPart.startsWith('`') && icPart.endsWith('`')) {
                                          return <code key={icIndex} className="bg-gray-100 text-red-500 px-1 rounded font-mono text-sm">{icPart.slice(1, -1)}</code>
                                      }
                                      return icPart;
                                  })}
                                </span>
                              )
                          })}
                      </p>
                  )
              })}
            </React.Fragment>
          );
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;