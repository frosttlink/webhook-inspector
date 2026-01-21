import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import * as Dialog from '@radix-ui/react-dialog'
import { WebhooksListItem } from './webhooks-list-item'
import { webhookListSchema } from '../http/schemas/webhooks'
import { Loader2, Wand2, Copy, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CodeBlock } from './ui/code-block'

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([])
  const [generateHandlerCode, setGenerateHandlerCode] = useState<string | null>(
    null,
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['webhooks'],
      queryFn: async ({ pageParam }) => {
        const url = new URL('http://localhost:3333/api/webhooks')

        if (pageParam) {
          url.searchParams.set('cursor', pageParam)
        }

        const response = await fetch(url)
        const data = await response.json()

        return webhookListSchema.parse(data)
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined
      },
      initialPageParam: undefined as string | undefined,
    })

  const webhooks = data.pages.flatMap((page) => page.webhooks)

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  function handleCheckWebhook(checkedWebhookId: string) {
    if (checkedWebhooksIds.includes(checkedWebhookId)) {
      setCheckedWebhooksIds((state) => {
        return state.filter((webhookId) => webhookId !== checkedWebhookId)
      })
    } else {
      setCheckedWebhooksIds((state) => [...state, checkedWebhookId])
    }
  }

  async function handleGenerateHnadler() {
    setIsGenerating(true)
    try {
      const response = await fetch('http://localhost:3333/api/generate', {
        method: 'POST',
        body: JSON.stringify({ webhookIds: checkedWebhooksIds }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      type GenerateResponse = { code: string }

      const data: GenerateResponse = await response.json()

      setGenerateHandlerCode(data.code)
      setIsCopied(false)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopyCode() {
    if (generateHandlerCode) {
      await navigator.clipboard.writeText(generateHandlerCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0

  return (
    <>
      <div className="flex-1 overflow-y-auto mac-scroll">
        <div className="space-y-1 p-2 ">
          <button
            disabled={!hasAnyWebhookChecked || isGenerating}
            className="bg-indigo-400 mb-3 text-white w-full rounded-lg flex items-center justify-center gap-3 font-medium text-sm py-2 disabled:opacity-50 hover:bg-indigo-500 transition-colors"
            onClick={() => handleGenerateHnadler()}
          >
            <Wand2 className={`size-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Gerando...' : 'Gerar Handler'}
          </button>

          {webhooks.map((webhook) => {
            return (
              <WebhooksListItem
                key={webhook.id}
                webhook={webhook}
                onWebhookChecked={handleCheckWebhook}
                isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
              />
            )
          })}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2 text-zinc-500">
                <Loader2 className="size-5 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {(isGenerating || !!generateHandlerCode) && (
        <Dialog.Root defaultOpen>
          <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />

          <Dialog.Content className="flex items-center justify-center fixed left-1/2 top-1/2 max-h-[85vh] -translate-x-1/2 -translate-y-1/2 w-[90vw] z-40">
            <div className="bg-zinc-900 w-[600px] p-6 rounded-lg border border-zinc-800 max-h-[620px] flex flex-col gap-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <p className="text-zinc-300 text-sm">Gerando handler com IA...</p>
                  <p className="text-zinc-500 text-xs">Analisando webhooks e criando código otimizado</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-100">Handler Gerado</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyCode}
                        className="p-2 hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-zinc-100"
                        title={isCopied ? 'Copiado!' : 'Copiar código'}
                      >
                        {isCopied ? (
                          <Check className="size-5 text-green-400" />
                        ) : (
                          <Copy className="size-5" />
                        )}
                      </button>
                      <button
                        onClick={() => setGenerateHandlerCode(null)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <CodeBlock language="typescript" code={generateHandlerCode || ''} />
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  )
}
