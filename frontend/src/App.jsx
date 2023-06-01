import { useState } from 'react'
// import logo from './assets/images/logo-universal.png'
import './App.css'
import Main from './components/Main'
import GamesStats from './components/GamesStats'
import Howlongtobeat from './components/Howlongtobeat'
import PcSpecs from './components/PcSpecs'
import GameDetails from './components/GameDetails'
import deathloop from './public/deathloop.jpg'
import mh from './public/mh.jpg'
import dishonored_2 from './public/dishonored_2.jpg'
import csgo from './public/csgo.jpg'
import katalyzt from './public/katalyzt.png'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './i18n'

function App() {
  const randomImage = () => {
    const imgArray = [deathloop, mh, dishonored_2, katalyzt, csgo]

    return imgArray[Math.floor(Math.random() * imgArray.length)]
  }

  const [resultText, setResultText] = useState(
    'Please enter your name below 👇',
  )
  const [name, setName] = useState('')
  const updateName = (e) => setName(e.target.value)
  const updateResultText = (result) => setResultText(result)

  return (
    <div id="App">
      <MemoryRouter>
        <div
          style={{ backgroundImage: `url(${randomImage()})` }}
          // style={{ backgroundColor: 'rgb(38, 50, 56)' }}
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
            <Route path="/pcspecs">
              <PcSpecs />
            </Route>
            <Route path="/GameDetails">
              <GameDetails />
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
