export const PRINTABLE_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,./<>?;:\'"[]\\{}|~!@#$%^&*()-_=+ öäüßÖÄÜ'.split(
    '',
)

export const SYMBOLS = ',./<>?;:\'"[]\\{}|~!@#$%^&*()-_=+'.split('')
export const NUMBERS = '0123456789'.split('')
export const RANDOM_LENGTH = 20

export const NEW_TEXT = 'NEW_TEXT'

export enum Mode {
    quote = 'quote',
    wiki = 'wiki',
    kafka = 'kafka',
    random = 'random',
    symbols = 'symbols',
    numbers = 'numbers',
    words = 'words',
    settings = 'settings',
    repeatedWords = 'custom',
}

export const GITHUB_URL = 'https://github.com/madnight'
