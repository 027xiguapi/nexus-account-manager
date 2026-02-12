/**
 * Provider 轮播选择组件 - 极简风格
 * 用于在添加账号时选择供应商
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, ExternalLink, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProviderPreset, ProviderCategory } from '@/types/provider'

interface ProviderCarouselProps {
  providers: ProviderPreset[]
  selectedId?: string
  onSelect: (id: string) => void
  isEn?: boolean
}

const categoryLabels: Record<ProviderCategory, { zh: string; en: string }> = {
  official: { zh: '官方', en: 'Official' },
  cn_official: { zh: '国产', en: 'CN' },
  aggregator: { zh: '聚合', en: 'Aggregator' },
  third_party: { zh: '第三方', en: '3rd Party' },
  custom: { zh: '自定义', en: 'Custom' },
}

export function ProviderCarousel({
  providers,
  selectedId,
  onSelect,
  isEn = false,
}: ProviderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 6
  const totalPages = Math.ceil(providers.length / itemsPerPage)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  const currentProviders = providers.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  return (
    <div className="space-y-3">
      <div className="relative px-10">
        {/* 左箭头 */}
        {totalPages > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* 卡片容器 */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-2"
            >
              {currentProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  isSelected={selectedId === provider.id}
                  onSelect={() => onSelect(provider.id)}
                  isEn={isEn}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 右箭头 */}
        {totalPages > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 分页指示器 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1 rounded-full transition-all",
                index === currentIndex
                  ? "w-6 bg-primary"
                  : "w-1 bg-border hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProviderCardProps {
  provider: ProviderPreset
  isSelected: boolean
  onSelect: () => void
  isEn: boolean
}

function ProviderCard({ provider, isSelected, onSelect, isEn }: ProviderCardProps) {
  const categoryLabel = categoryLabels[provider.category || 'custom']

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative group flex flex-col items-center justify-center p-3 rounded-lg border transition-all min-h-[90px]",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      {/* 选中标记 */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-primary-foreground" />
        </div>
      )}

      {/* 合作伙伴星标 */}
      {provider.isPartner && !isSelected && (
        <Star className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
      )}

      {/* 分类标签 */}
      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground bg-muted/50">
        {isEn ? categoryLabel.en : categoryLabel.zh}
      </div>

      {/* 供应商名称 */}
      <div className="text-sm font-medium text-center mt-4 line-clamp-2">
        {provider.name}
      </div>
    </button>
  )
}

interface ProviderInfoProps {
  provider: ProviderPreset
  isEn: boolean
}

export function ProviderInfo({ provider, isEn }: ProviderInfoProps) {
  const categoryLabel = categoryLabels[provider.category || 'custom']

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-lg border bg-muted/30 space-y-2"
    >
      {/* 头部 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{provider.name}</h3>
            {provider.isPartner && (
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {isEn ? categoryLabel.en : categoryLabel.zh}
          </div>
        </div>

        {provider.apiKeyUrl && (
          <a
            href={provider.apiKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            {isEn ? 'Get Key' : '获取'}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* 描述 */}
      {provider.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {provider.description}
        </p>
      )}

      {/* 网站链接 */}
      {provider.websiteUrl && (
        <a
          href={provider.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {provider.websiteUrl.replace(/^https?:\/\//, '')}
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      )}
    </motion.div>
  )
}
