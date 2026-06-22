import { useEffect, useState } from 'react';

// Translations
const translations = {
    en: { light: 'Light', dark: 'Dark', midnight: 'Midnight', label: 'Theme' },
    pt: {
        light: 'Claro',
        dark: 'Escuro',
        midnight: 'Meia-Noite',
        label: 'Tema',
    },
};

let currentLanguage: keyof typeof translations = 'pt'; // This could be dynamically set based on user preference or browser settings

// Avaliable themes
type theme = 'light' | 'dark' | 'midnight';

export function ThemeToggler() {
    // Getter hook for the current or the default theme from localStorage and set it as the initial state of the theme. This way, when the user refreshes the page, the last chosen theme will be applied instead of resetting to a default one.
    const [theme, setTheme] = useState<theme>(() => {
        // Lazy initialization to read from localStorage only once, not every time the component renders
        const storedTheme = localStorage.getItem('appendix-theme') as theme;
        // get the theme from localStorage
        return ['light', 'dark', 'midnight'].includes(storedTheme)
            ? storedTheme
            : 'dark';
        // if the theme's a valid one,  return it, otherwise default to 'dark'
    });

    // Hook to apply the theme when theme changes
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'midnight'); // Remove all theme classes from the page
        root.classList.add(theme); // Add the current chosen theme class to the page
        localStorage.setItem('appendix-theme', theme); // Save the current theme to localStorage so it persists across page reloads
    }, [theme]); // This effect runs every time the theme state changes, applying the new theme to the page and saving it to localStorage

    // The jsx for the button to change the theme
    return (
        <div>
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as theme)}
                className="bg-surface border border-border-main text-main rounded-lg p-2 
                   text-xs font-semibold shadow-xs transition-colors duration-200 
                   focus:outline-hidden focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
                <option value="light">
                    {translations[currentLanguage].light}
                </option>
                <option value="dark">
                    {translations[currentLanguage].dark}
                </option>
                <option value="midnight">
                    {translations[currentLanguage].midnight}
                </option>
            </select>
        </div>
    );
}
