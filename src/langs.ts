import { readFileSync } from 'fs'
import { get } from 'lodash'
import { resolve } from 'path'

const parameterizedString = (...args) => {
  const params = args.slice(1)
  return args[0].replace(/\$[0-9]+/g, matchedStr => (params[matchedStr.replace('$', '')]))
}

const langsDir = resolve(process.cwd(), 'langs')

export class Lang {
  code: string
  lang: JSON

  constructor(lang = 'english') {
    this.code = lang
    this.lang = JSON.parse(readFileSync(`${langsDir}/${lang}.json`, { encoding: 'UTF-8' }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(...args: any[]) {
    const path = args[0]
    const result = get(this.lang, path, null)

    if (!result) return get(this.lang, 'errors.langStringNotFound')
    return parameterizedString(result, ...args.slice(1))
  }
}
