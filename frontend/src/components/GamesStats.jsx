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
  FindTotalTimePlayedLastWeek,
  FindTotalTimePlayedLastMonth,
  FindMostPlayedGame,
  FindTotalGamesPlayedLastWeek,
} from '../../wailsjs/go/main/App'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

function GamesStats() {
  let history = useHistory()
  const { t, i18n } = useTranslation()

  const [apps, setApps] = useState([])
  const [totalTimePlayed, setTotalTimePlayed] = useState(0)
  const [totalTimePlayedLastWeek, setTotalTimePlayedLastWeek] = useState(0)
  const [totalTimePlayedLastMonth, setTotalTimePlayedLastMonth] = useState(0)
  const [totalGamePlayedLastWeek, setTotalGamePlayedLastWeek] = useState([])
  const [mostPlayedGameName, setMostPlayedGameName] = useState('')
  const [mostPlayedGameTotal, setMostPlayedGameTotal] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

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

  const handleFindTotalGamesPlayedLastWeek = async () => {
    const now = new Date()

    let lastWeek = format(now.getTime() - 7 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    let today = format(now.getTime() + 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    await FindTotalGamesPlayedLastWeek(today, lastWeek).then((result) => {
      // console.log(result)
      setTotalGamePlayedLastWeek(result)
    })
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

  useEffect(() => {
    window.scrollTo(0, 0)
    handleFindAll()
    handleFindTotalTimePlayed()
    handleFindTotalTimePlayedLastWeek()
    handleFindTotalTimePlayedLastMonth()
    handleMostPlayedGame()
    handleFindTotalGamesPlayedLastWeek()
  }, [])

  return (
    <div style={{ overflow: 'scroll', overflowX: 'hidden'}}>
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
            color: 'white',
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
            color={'white'}
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
            color: 'white',
            float: 'left',
            marginLeft: '46px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => history.push('/howlongtobeat')}
        >
          <LetterH
            size={30}
            strokeWidth={2}
            color={'white'}
            style={{ marginTop: '-6px' }}
          />{' '}
          HowLongToBeat
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
          V1.3.1
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
                title={t('mostPlayedGame') + '(' + mostPlayedGameName + ')'}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            {/* <Col style={{ height: '100px' }}>
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
								title='TOTAL TIME PLAYED THE LAST WEEK'
								fetching={false}
								error={null}
								icon={<Clock size={30} strokeWidth={1} color={'white'} />}
								iconBgColor="transparent"
								iconColor="transparent"
							/>
						</Col> */}

            {/* <Col style={{ height: '100px' }}>
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
								title='TOTAL TIME PLAYED THE LAST MONTH'
								fetching={false}
								error={null}
								icon={<Clock size={30} strokeWidth={1} color={'white'} />}
								iconBgColor="transparent"
								iconColor="transparent"
							/>
						</Col> */}
          </Row>
          <br></br>
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
                <th style={{ color: 'white' }}>{t('dateAndTime')}</th>
              </tr>
            </thead>
            <tbody>
              {totalGamePlayedLastWeek.map((game, index) => {
                return (
                  <tr key={index}>
                    <td style={{ color: 'white' }}>{game.Name}</td>
                    <td style={{ color: 'white' }}>
                      {getDayOfWeek(new Date(game.UpdatedAt).getDay())}
                    </td>
                    <td style={{ color: 'white' }}>
                      {format(new Date(game.UpdatedAt), 'yyyy/MM/dd hh:mm aaa')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  )
}

export default GamesStats
