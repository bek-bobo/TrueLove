import React from 'react';

interface NewspaperRansomLetterProps {
  text: string;
  className?: string;
}

// Vintage newspaper color palettes and styles for clipped letters
const STYLES = [
  'bg-[#111] text-[#fff] font-serif font-black uppercase shadow-xs rotate-[-2deg] border border-[#333]',
  'bg-[#f4ebd0] text-[#8b0000] font-mono font-bold uppercase rotate-[1deg] border border-[#a68c68]',
  'bg-[#8b0000] text-[#f4ebd0] font-sans font-extrabold uppercase rotate-[-3deg]',
  'bg-[#dcd6c8] text-[#1a1a1a] font-serif italic font-bold shadow-xs rotate-[2deg] underline',
  'bg-[#1e2a38] text-[#e2b86b] font-mono font-black uppercase rotate-[-1deg]',
  'bg-[#e9dfcc] text-[#2b2b2b] font-sans font-black tracking-tighter rotate-[3deg] border border-[#444]',
  'bg-[#3a2012] text-[#f5ebd9] font-serif font-bold uppercase rotate-[-2deg]',
];

export const NewspaperRansomLetter: React.FC<NewspaperRansomLetterProps> = ({
  text,
  className = '',
}) => {
  const words = text.split(' ');

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-2 select-none leading-none ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex items-center gap-0.5 whitespace-nowrap">
          {word.split('').map((char, cIdx) => {
            const styleIdx = (wIdx * 5 + cIdx) % STYLES.length;
            const style = STYLES[styleIdx];

            return (
              <span
                key={cIdx}
                className={`inline-block px-1 py-0.5 text-xs sm:text-sm transition-transform hover:scale-110 cursor-default ${style}`}
                style={{
                  display: 'inline-block',
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};
