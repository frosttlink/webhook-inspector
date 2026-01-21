import { useEffect, useState, type ComponentProps } from 'react'
import { codeToHtml } from 'shiki'
import { twMerge } from 'tailwind-merge'

interface CodeBlockProps extends ComponentProps<'div'> {
  code: string
  language?: string
}

export function CodeBlock({
  className,
  code,
  language = 'json',
  ...props
}: CodeBlockProps) {
  const [parsedCode, setParsedCode] = useState('')

  useEffect(() => {
    if (code) {
      codeToHtml(code, { lang: language, theme: 'vesper' }).then((parsed) =>
        setParsedCode(parsed),
      )
    }
  }, [code, language])

  return (
    <div
      className={twMerge(
        'relative rounded-lg border border-zinc-700 overflow-hidden',
        className,
      )}
      {...props}
    >
      <div
        className="mac-scroll overflow-x-auto overflow-y-auto max-h-[600px] [&_pre]:p-4 [&_pre]:m-0 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:leading-relaxed [&_code]:whitespace-pre-wrap [&_code]:break-words"
        dangerouslySetInnerHTML={{ __html: parsedCode }}
      />
    </div>
  )
}
