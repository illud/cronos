import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import './Main.css'
import Drawer from 'react-modern-drawer'
import {
  DeviceAnalytics,
  DeviceDesktop,
  Clock,
  LetterH,
  Cpu2,
  BrandPatreon,
} from 'tabler-icons-react'
import { useHistory } from 'react-router-dom'
// import testedGamesJson from './testedgames.json'
import MetricCard from 'react-metric-card'
import 'react-metric-card/dist/index.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  FindAll,
  FindTotalTimePlayed,
  FindTotalTimePlayedGameToday,
  FindTotalTimePlayedGameThisWeek,
  FindTotalTimePlayedToday,
  FindTotalTimePlayedLastWeek,
  FindTotalTimePlayedLastMonth,
  FindMostPlayedGame,
  FindTotalGamesPlayedLastWeek,
  FindTotalTimePlayedLastYear,
} from '../../wailsjs/go/main/App'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

function GamesStats() {
  let history = useHistory()
  const { t, i18n } = useTranslation()

  const [apps, setApps] = useState([])
  const [totalTimePlayed, setTotalTimePlayed] = useState(0)
  const [totalTimePlayedGameToday, setTotalTimePlayedGameToday] = useState([])
  const [totalTimePlayedGameThisWeek, setTotalTimePlayedGameThisWeek] =
    useState([])
  const [totalTimePlayedToday, setTotalTimePlayedToday] = useState(0)
  const [totalTimePlayedLastWeek, setTotalTimePlayedLastWeek] = useState(0)
  const [totalTimePlayedLastMonth, setTotalTimePlayedLastMonth] = useState(0)
  const [totalTimePlayedLastYear, setTotalTimePlayedLastYear] = useState(0)
  const [totalGamePlayedLastWeek, setTotalGamePlayedLastWeek] = useState([])
  const [mostPlayedGameName, setMostPlayedGameName] = useState('')
  const [mostPlayedGameTotal, setMostPlayedGameTotal] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const handleFindAll = async () => {
    await FindAll().then((result) => {
      setApps(result)
    })
  }

  const handleFindTotalTimePlayed = async () => {
    await FindTotalTimePlayed().then((result) => {
      setTotalTimePlayed(result)
    })
  }

  const handleFindTotalTimePlayedToday = async () => {
    const now = new Date()

    let today = format(now.getTime() + 0 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')
    let tomorrow = format(now.getTime() + 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    await FindTotalTimePlayedToday(today, tomorrow).then((result) => {
      setTotalTimePlayedToday(result)
    })
  }

  const handleFindTotalTimePlayedLastWeek = async () => {
    const now = new Date()

    let lastWeek = format(now.getTime() - 7 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    let today = format(now.getTime() + 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    await FindTotalTimePlayedLastWeek(today, lastWeek).then((result) => {
      setTotalTimePlayedLastWeek(result)
    })
  }

  const handleFindTotalTimePlayedLastMonth = async () => {
    const now = new Date()

    let lastMonth = format(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
      'yyyy-MM-dd',
    )

    let today = format(now.getTime() + 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    await FindTotalTimePlayedLastMonth(today, lastMonth).then((result) => {
      setTotalTimePlayedLastMonth(result)
    })
  }

  const handleFindTotalTimePlayedLastYear = async () => {
    const now = new Date()

    let lastYear = format(
      now.getTime() - 365 * 24 * 60 * 60 * 1000,
      'yyyy-MM-dd',
    )

    let today = format(now.getTime() + 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    await FindTotalTimePlayedLastYear(today, lastYear).then((result) => {
      setTotalTimePlayedLastYear(result)
    })
  }

  const handleFindTotalGamesPlayedLastWeek = async () => {
    const now = new Date()

    let lastWeek = format(now.getTime() - 7 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    let todayLastWeek = format(
      now.getTime() + 1 * 24 * 60 * 60 * 1000,
      'yyyy-MM-dd',
    )

    await FindTotalGamesPlayedLastWeek(todayLastWeek, lastWeek).then(
      (result) => {
        // console.log(result)
        setTotalGamePlayedLastWeek(result)

        //__TIME PLAYED TODAY__

        let totalTimePlayedGameTodayArrays = []
        for (let index = 0; index < result.length; index++) {
          totalTimePlayedGameTodayArrays.push(result[index].Id)
        }

        const now = new Date()

        let today = format(
          now.getTime() + 0 * 24 * 60 * 60 * 1000,
          'yyyy-MM-dd',
        )
        let tomorrow = format(
          now.getTime() + 1 * 24 * 60 * 60 * 1000,
          'yyyy-MM-dd',
        )

        FindTotalTimePlayedGameToday(
          today,
          tomorrow,
          totalTimePlayedGameTodayArrays,
        ).then((result) => {
          setTotalTimePlayedGameToday(result)
        })

        //__TIME PLAYED THIS WEEK__

        let lastWeek = format(
          now.getTime() - 7 * 24 * 60 * 60 * 1000,
          'yyyy-MM-dd',
        )

        let toDay = format(
          now.getTime() + 1 * 24 * 60 * 60 * 1000,
          'yyyy-MM-dd',
        )

        let totalTimePlayedGameThisWeekArray = []

        for (let index = 0; index < result.length; index++) {
          totalTimePlayedGameThisWeekArray.push(result[index].Id)
        }

        FindTotalTimePlayedGameThisWeek(
          toDay,
          lastWeek,
          totalTimePlayedGameThisWeekArray,
        ).then((result) => {
          // arrayOfGameTimesWeek.push(result)
          setTotalTimePlayedGameThisWeek(result)
        })

        setIsLoading(false)
      },
    )
  }

  const handleMostPlayedGame = async () => {
    await FindMostPlayedGame().then((result) => {
      setMostPlayedGameName(result.Name)
      setMostPlayedGameTotal(result.Total)
    })
  }

  const secondsToTime = (e) => {
    var h = Math.floor(e / 3600)
        .toString()
        .padStart(1, '0'),
      m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(1, '0'),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, '0')

    return h + ' h ' + m + ' m'
    // return h + ':' + m + ':' + s;
    //return `${h}:${m}:${s}`;
  }

  const getDayOfWeek = (dayOfWeekNumber) => {
    switch (dayOfWeekNumber) {
      case 0:
        return t('sunday')
      case 1:
        return t('monday')
      case 2:
        return t('tuesday')
      case 3:
        return t('wednesday')
      case 4:
        return t('thursday')
      case 5:
        return t('friday')
      case 6:
        return t('saturday')
    }
  }

  const openPatreon = () => {
    window.open(
      'https://www.patreon.com/user?u=79481740&utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator',
      '_blank',
      'noopener,noreferrer',
    )
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    async function getInitialData() {
      await handleFindAll()

      await handleFindTotalGamesPlayedLastWeek()

      await handleFindTotalTimePlayed()
      await handleFindTotalTimePlayedToday()
      await handleFindTotalTimePlayedLastWeek()
      await handleFindTotalTimePlayedLastMonth()
      await handleMostPlayedGame()
      await handleFindTotalTimePlayedLastYear()
    }

    getInitialData()
  }, [])

  return (
    <div style={{ overflow: 'scroll', overflowX: 'hidden' }}>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        enableOverlay={false}
        direction="left"
        className="bla bla bla"
        style={{ background: 'rgba(0, 0, 0, 0.5)', width: '20%' }}
      >
        <h4 style={{ color: 'white', marginTop: '20px', fontStyle: 'bold' }}>
          CR
          <Clock
            size={24}
            strokeWidth={1}
            color={'white'}
            style={{ marginTop: '-5px' }}
          />
          NOS
        </h4>

        <br></br>
        <hr style={{ color: 'white', height: '1px', marginTop: '-10px' }}></hr>
        {/* <div style={{ color: 'white', float: 'left', marginLeft: '40px' }}>
					GAMES
				</div> */}
        <br></br>
        <div
          style={{
            background: 'transparent',
            color: 'white',
            height: '38px',
            width: '5px',
            float: 'left',
          }}
        ></div>
        <Button
          style={{
            color: '#D9D9D9',
            float: 'left',
            marginLeft: '40px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => history.push('/main')}
        >
          <DeviceDesktop
            size={30}
            strokeWidth={1}
            color={'#D9D9D9'}
            style={{ marginTop: '-6px' }}
          />{' '}
          {t('allGames')}{' '}
          <Badge pill bg="primary" style={{ background: 'green' }}>
            {apps.length}
          </Badge>
        </Button>

        <br></br>
        <br></br>
        <div
          className="barHeight"
          style={{
            background: '#007bff',
            color: 'white',
            height: '38px',
            width: '5px',
            float: 'left',
          }}
        ></div>
        <Button
          style={{
            color: 'white',
            float: 'left',
            marginLeft: '40px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
        >
          <DeviceAnalytics
            size={30}
            strokeWidth={1}
            color={'white'}
            style={{ marginTop: '-6px' }}
          />{' '}
          {t('stats')}{' '}
        </Button>

        <br></br>
        <br></br>
        <Button
          style={{
            color: '#D9D9D9',
            float: 'left',
            marginLeft: '46px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => history.push('/howlongtobeat')}
        >
          <LetterH
            size={30}
            strokeWidth={1}
            color={'#D9D9D9'}
            style={{ marginTop: '-6px' }}
          />{' '}
          HowLongToBeat
        </Button>

        <br></br>
        <br></br>
        <Button
          style={{
            color: '#D9D9D9',
            float: 'left',
            marginLeft: '46px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => history.push('/pcspecs')}
        >
          <Cpu2
            size={30}
            strokeWidth={1}
            color={'#D9D9D9'}
            style={{ marginTop: '-6px' }}
          />{' '}
          {t('pcSpecs')}
        </Button>

        <br></br>
        <br></br>
        <Button
          style={{
            color: 'white',
            float: 'left',
            marginLeft: '49px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => openPatreon()}
        >
          <BrandPatreon
            size={28}
            strokeWidth={1}
            color={'white'}
            style={{ marginTop: '-6px' }}
          />{' '}
          Patreon
        </Button>

        <hr
          style={{
            color: 'white',
            height: '1px',
            left: 0,
            bottom: 0,
            position: 'absolute',
          }}
        ></hr>
        <div
          style={{
            color: 'white',
            bottom: '0',
            textAlign: 'center',
            background: 'transparent',
            borderColor: 'transparent',
            position: 'absolute',
            left: 0,
            marginLeft: '40%',
          }}
        >
          v1.6.3
        </div>
      </Drawer>
      <div style={{ marginLeft: '320px' }}>
        <Container className="Container">
          <br></br>
          <br></br>

          <Row xs={2} md={2} className="g-4">
            <Col style={{ height: '100px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={secondsToTime(totalTimePlayed)}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('totalTimePlayed')}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '100px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={secondsToTime(mostPlayedGameTotal)}
                // trend={{
                // 	slope: 1,
                // 	description: {mostPlayedGameName},
                // 	value: '0.5%'
                // }}
                title={t('mostPlayedGame') + ' (' + mostPlayedGameName + ')'}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '100px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={secondsToTime(totalTimePlayedToday)}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('playedTimeToday')}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '100px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={secondsToTime(totalTimePlayedLastWeek)}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('playedTimeThisWeek')}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '100px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={secondsToTime(totalTimePlayedLastMonth)}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('playedTimeThisMonth')}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '100px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={secondsToTime(totalTimePlayedLastYear)}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('playedTimeThisYear')}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>
          </Row>
          <br></br>

          <h5 style={{ color: 'white' }}>{t('gamesPlayedThisWeek')}</h5>
          <br></br>
          <Table
            bordered
            hover
            style={{
              color: 'white',
              background: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'transparent',
            }}
          >
            <thead>
              <tr>
                <th style={{ color: 'white' }}>{t('game')}</th>
                <th style={{ color: 'white' }}>{t('day')}</th>
                <th style={{ color: 'white' }}>{t('playedToday')}</th>
                <th style={{ color: 'white' }}>{t('playedLastWeek')}</th>
                <th style={{ color: 'white' }}>{t('dateAndTime')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <p></p>
              ) : (
                totalGamePlayedLastWeek.map((game, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ color: 'white', fontSize: '18px' }}>
                        {game.Name}
                      </td>
                      <td style={{ color: 'white', fontSize: '18px' }}>
                        {getDayOfWeek(new Date(game.UpdatedAt).getDay())}
                      </td>
                      <td style={{ color: 'white', fontSize: '18px' }}>
                        {secondsToTime(totalTimePlayedGameToday[index])}{' '}
                      </td>
                      <td style={{ color: 'white', fontSize: '18px' }}>
                        {secondsToTime(totalTimePlayedGameThisWeek[index])}{' '}
                      </td>
                      <td style={{ color: 'white', fontSize: '18px' }}>
                        {format(
                          new Date(game.UpdatedAt),
                          'yyyy/MM/dd hh:mm aaa',
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
          <br></br>
          <br></br>
        </Container>
      </div>
    </div>
  )
}

export default GamesStats
