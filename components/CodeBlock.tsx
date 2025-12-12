import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-inner border border-gray-200 dark:border-gray-700 h-full">
      <pre>{code}</pre>
    </div>
  );
};