'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from '@/Components/ui/command'
import { cn } from '@/lib/utils'
import TextInput from './TextInput'

export default function Autocomplete({
    data = [],
    onChange,
    value,
    suppressAutoFocus = false
}) {
    const [inputValue, setInputValue] = useState('')
    const [filteredOptions, setFilteredOptions] = useState([])
    const [open, setOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [forceShowAll, setForceShowAll] = useState(false)
    const wrapperRef = useRef(null)
    const inputRef = useRef(null)
    const suppressFocusRef = useRef(suppressAutoFocus)

    // Atualiza lista
    useEffect(() => {
        if (inputValue === '' && !forceShowAll) {
            setFilteredOptions([])
            return
        }

        const result = forceShowAll
            ? data
            : data.filter(item =>
                  item.label.toLowerCase().includes(inputValue.toLowerCase())
              )
        setFilteredOptions(result)
    }, [inputValue, data, forceShowAll])

    // Escape e clique fora
    useEffect(() => {
        const handleKeyDown = e => {
            if (e.key === 'Escape') {
                setOpen(false)
                setForceShowAll(false)
                setHighlightedIndex(-1)
            }
        }

        const handleClickOutside = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
                setForceShowAll(false)
                setHighlightedIndex(-1)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Inicializa com value
    useEffect(() => {
        if (value !== undefined && value !== null) {
            const selected = data.find(
                item => item.value === value || item.label === value
            )
            if (selected) setInputValue(selected.label)
        }
    }, [value, data])

    // Reset suprimir foco após abrir
    useEffect(() => {
        if (suppressAutoFocus) {
            setTimeout(() => {
                suppressFocusRef.current = false
            }, 200)
        }
    }, [suppressAutoFocus])

    const handleInputKeyDown = e => {
        if (!open) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlightedIndex(prev =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
            )
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlightedIndex(prev =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
            )
        }

        if (e.key === 'Enter' && highlightedIndex >= 0) {
            const selected = filteredOptions[highlightedIndex]
            if (selected) {
                selectOption(selected)
            }
        }

        if (e.key === 'Tab') {
            setOpen(false)
            setForceShowAll(false)
            setHighlightedIndex(-1)
        }
    }

    const selectOption = item => {
        setInputValue(item.label)
        setOpen(false)
        setForceShowAll(false)
        setHighlightedIndex(-1)
        onChange?.(item.value, item)
    }

    const handleChevronClick = () => {
        if (inputValue.trim() === '') {
            setForceShowAll(true)
        } else {
            setForceShowAll(false)
        }
        setOpen(true)
        setHighlightedIndex(0)
        inputRef.current?.focus()
    }

    return (
        <div className='relative w-full' ref={wrapperRef}>
            <div className='relative w-full'>
                <TextInput
                    ref={inputRef}
                    type='text'
                    className='w-full pr-10'
                    value={inputValue}
                    onChange={e => {
                        const raw = e.target.value
                        const lowerRaw = raw.toLowerCase()
                        setInputValue(raw)
                        setForceShowAll(false)
                        setOpen(true)
                        setHighlightedIndex(0)

                        // Apenas filtra, não seleciona automaticamente
                        const matches = data.filter(item =>
                            item.label.toLowerCase().includes(lowerRaw)
                        )

                        onChange?.(raw, null)
                    }}
                    onFocus={() => {
                        if (suppressFocusRef.current) return
                        if (inputValue === '') setForceShowAll(true)
                        setOpen(true)
                    }}
                    onBlur={e => {
                        if (!wrapperRef.current.contains(e.relatedTarget)) {
                            setOpen(false)
                            setForceShowAll(false)
                            setHighlightedIndex(-1)
                        }
                    }}
                    onKeyDown={handleInputKeyDown}
                />

                <button
                    type='button'
                    className='absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:text-gray-600'
                    onClick={handleChevronClick}
                    tabIndex={-1}
                >
                    <ChevronDown size={18} />
                </button>
            </div>

            {open && filteredOptions.length > 0 && (
                <div className='absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-60 overflow-y-auto'>
                    <Command>
                        <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((item, index) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => selectOption(item)}
                                    tabIndex={0}
                                    className={cn(
                                        'cursor-pointer',
                                        index === highlightedIndex &&
                                            'bg-indigo-500 text-white'
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            inputValue === item.label
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </div>
            )}
        </div>
    )
}
