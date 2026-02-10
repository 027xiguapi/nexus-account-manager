import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

interface AccountSearchProps {
  value: string
  onChange: (value: string) => void
  resultCount?: number
  className?: string
}

export function AccountSearch({ value, onChange, resultCount, className }: AccountSearchProps) {
  const { t } = useTranslation()

  return (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder={t('common.searchAccounts', 'Search by email or name...')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {value && resultCount !== undefined && (
        <InputGroupAddon align="inline-end">
          {resultCount} {t('common.results', 'results')}
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
