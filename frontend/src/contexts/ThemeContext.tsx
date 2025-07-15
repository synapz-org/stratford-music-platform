import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme')
        return (saved as Theme) || 'system'
    })

    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.classList.add(systemTheme)
            setIsDark(systemTheme === 'dark')
        } else {
            root.classList.add(theme)
            setIsDark(theme === 'dark')
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            if (theme === 'system') {
                const root = window.document.documentElement
                root.classList.remove('light', 'dark')
                const systemTheme = mediaQuery.matches ? 'dark' : 'light'
                root.classList.add(systemTheme)
                setIsDark(systemTheme === 'dark')
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    const value: ThemeContextType = {
        theme,
        setTheme,
        isDark,
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
} 