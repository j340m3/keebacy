export const PRINTABLE_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,./<>?;:\'"[]\\{}|~!@#$%^&*()-_=+ öäüßÖÄÜ'.split('',)

export const SYMBOLS = ',./<>?;:\'"[]\\{}|~!@#$%^&*()-_=+'.split('')
export const NUMBERS = '0123456789'.split('')
export const RANDOM_LENGTH = 20

export enum Mode {
  quote = 'quote',
  wiki = 'wiki',
  random = 'random',
  symbols = 'symbols',
  numbers = 'numbers',
  words = 'words',
  repeatedWords = 'repeated words',
}

export const GITHUB_URL = 'https://github.com/madnight'
