import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detectBrowserLanguage from 'detect-browser-language'
//languages
import enLang from './components/lang/en.json'
import esLang from './components/lang/es.json'

let language = detectBrowserLanguage()
let languageFormated = language.split('-')[0]
let languages = 'en'

switch (languageFormated) {
  case 'en':
    languages = 'en'
    break

  case 'es':
    languages = 'es'
    break

  default:
    languages = 'en'
    break
}

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: enLang,
  },
  es: {
    translation: esLang,
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: languages, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
