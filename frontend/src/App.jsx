import { useState } from 'react'
import logo from './assets/images/logo-universal.png'
import './App.css'
import Main from './components/Main'
import GamesStats from './components/GamesStats'
import Howlongtobeat from './components/Howlongtobeat'
import deathloop from './public/deathloop.jpg'
import deathloop_2 from './public/deathloop_2.jpg'
import mh from './public/mh.jpg'
import mh_3 from './public/mh_3.jpg'
import re from './public/re.jpg'
import re2 from './public/re2.jpg'
import dishonored from './public/dishonored.jpg'
import dishonored_2 from './public/dishonored_2.jpg'
import katalyzt from './public/katalyzt.png'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import './i18n'
import { Greet } from '../wailsjs/go/main/App'

function App() {
  const randomImage = () => {
    const imgArray = [
      deathloop,
      deathloop_2,
      mh,
      mh_3,
      re,
      re2,
      dishonored,
      dishonored_2,
      katalyzt,
    ]

    return imgArray[Math.floor(Math.random() * imgArray.length)]
  }

  const [resultText, setResultText] = useState(
    'Please enter your name below 👇',
  )
  const [name, setName] = useState('')
  const updateName = (e) => setName(e.target.value)
  const updateResultText = (result) => setResultText(result)

  function greet() {
    Greet(name).then(updateResultText)
  }

  return (
    <div id="App">
      <MemoryRouter>
        <div
          style={{ backgroundImage: `url(${randomImage()})` }}
          id="app"
          className="App"
        >
          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/allgames">
              <Main />
            </Route>
            <Route path="/gamesstats">
              <GamesStats />
            </Route>
            <Route path="/howlongtobeat">
              <Howlongtobeat />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </div>
      </MemoryRouter>
    </div>
  )
}

export default App
