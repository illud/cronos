import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detectBrowserLanguage from 'detect-browser-language'

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
    translation: {
      add: 'Add',
      reload: 'Reload',
      searchGame: 'Search Game',
      allGames: 'All Games',
      stats: 'Stats',
      totalPlayTime: 'TOTAL PLAY TIME',
      lastTimePlayed: 'LAST TIME PLAYED',
      play: 'Play',
      running: 'Running',
      removing: 'Removing',
      areYouDhureYouWantToRemoveTheGame:
        '¿Are you shure you want to remove the game?',
      enterGameName: 'Enter game name',
      gameExe: 'GAME EXE',
      addingNewGame: 'Adding new game',
      editing: 'Editing',
      addBtn: 'Add',
      closeBtn: 'Close',
      updateBtn: 'Update',
      removeBtn: 'Remove',
      totalTimePlayed: 'TOTAL TIME PLAYED',
      mostPlayedGame: 'MOST PLAYED GAME',
      gamesPlayedThisWeek: 'GAMES PLAYED THIS WEEK',
      playedTimeToday: 'TIME PLAYED TODAY',
      playedTimeThisWeek: 'TOTAL TIME PLAYED THE LAST WEEK',
      playedTimeThisMonth: 'TOTAL TIME PLAYED THE LAST MONTH',
      playedTimeThisYear: 'TOTAL TIME PLAYED THE LAST YEAR',
      playedToday: 'PLAYED TODAY',
      playedLastWeek: 'PLAYED THIS WEEK',
      game: 'GAME',
      day: 'DAY',
      dateAndTime: 'DATE & TIME',
      toastRunning: 'Running',
      toastPleaseFillAllFields: 'Please fill all fields',
      toastSuccessfulCreation: 'Successful creation',
      toastSuccessfulUpdate: 'Successful update',
      toastRemoved: 'Removed!',
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      gameplayMain: 'MAIN',
      gameplayMainExtra: '+EXTRAS',
      gameplayCompletionist: 'COMPLETE',
      noResultsFound: 'No results found',
      internetCon: 'You are not connected to internet',
      pcSpecs: 'Pc Specs',
      Hostname: 'HOSTNAME',
      Platform: 'PLATFORM',
      OsNumber: 'OsNumber',
      CPU: 'CPU',
      GPU: 'GPU',
      RAM: 'RAM',
      Disk: 'Disk',
      MAINBOARD: 'MAINBOARD',
      howLontTobeatSourced: 'Hours data sourced from',
      goBack: 'Go back',
      timePlayedByDayThisWeek: 'TIME BY DAY THIS WEEK',
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      stats: 'Stats',
      timeByDayForTheLastWeek: 'HOURS PLAYED PER DAY IN THE LAST WEEK',
      notRunning: 'Not Running',
    },
  },
  es: {
    translation: {
      add: 'Agregar',
      reload: 'Recargar',
      searchGame: 'Buscar Juego...',
      allGames: 'Tus Juegos',
      stats: 'Estadísticas',
      totalPlayTime: 'TIEMPO TOTAL DE JUEGO',
      lastTimePlayed: 'ÚLTIMA VEZ JUGADO',
      play: 'Jugar',
      running: 'Ejecutando',
      removing: 'Eliminando',
      areYouDhureYouWantToRemoveTheGame:
        '¿Estás seguro de que quieres eliminar el juego?',
      enterGameName: 'Introduce el nombre del juego',
      gameExe: 'JUEGO',
      addingNewGame: 'Agregando nuevo juego',
      editing: 'Editando',
      addBtn: 'Agregar',
      closeBtn: 'Cerrar',
      updateBtn: 'Actualizar',
      removeBtn: 'Remover',
      totalTimePlayed: 'TIEMPO TOTAL JUGADO',
      mostPlayedGame: 'JUEGO MÁS JUGADO',
      gamesPlayedThisWeek: 'JUEGOS JUGADOS ESTA SEMANA',
      playedTimeToday: 'TIEMPO JUGADO HOY',
      playedTimeThisWeek: 'TIEMPO TOTAL JUGADO LA ÚLTIMA SEMANA',
      playedTimeThisMonth: 'TIEMPO TOTAL JUGADO EL ÚLTIMO MES',
      playedTimeThisYear: 'TIEMPO TOTAL JUGADO EL ÚLTIMO AÑO',
      playedToday: 'JUGADO HOY',
      playedLastWeek: 'JUGADO ESTA SENANA',
      game: 'JUEGO',
      day: 'DÍA',
      dateAndTime: 'FECHA Y HORA',
      toastRunning: 'Ejecutando',
      toastPleaseFillAllFields: 'Por favor llena todos los espacios',
      toastSuccessfulCreation: 'Creación exitosa',
      toastSuccessfulUpdate: 'Actualización exitosa',
      toastRemoved: 'Removido!',
      sunday: 'Domingo',
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      gameplayMain: 'HISTORIA',
      gameplayMainExtra: '+EXTRAS',
      gameplayCompletionist: 'COMPLETISTAS',
      noResultsFound: 'No se han encontrado resultados',
      internetCon: 'No estás conectado a internet',
      pcSpecs: 'Tu Pc',
      Hostname: 'NOMBRE DEL EQUIPO',
      Platform: 'PLATAFORMA',
      OsNumber: 'OsNumber',
      CPU: 'CPU',
      GPU: 'GPU',
      RAM: 'RAM',
      Disk: 'DICO PRINCIPAL',
      MAINBOARD: 'PLACA BASE',
      howLontTobeatSourced: 'Datos de horas obtenidos de',
      goBack: 'Volver',
      timePlayedByDayThisWeek: 'TIEMPO POR DÍA ESTA SEMANA',
      sunday: 'Domingo',
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miercoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sabado',
      stats: 'Estadísticas',
      timeByDayForTheLastWeek: 'HORAS JUGADAS POR DÍA DE LA ÚLTIMA SEMANA',
      notRunning: 'Durmiendo',
    },
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
