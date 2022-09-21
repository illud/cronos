import React, { useRef, useState, useEffect } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import './Main.css'
import Badge from 'react-bootstrap/Badge'
import Drawer from 'react-modern-drawer'
import MetricCard from 'react-metric-card'
import {
  DeviceAnalytics,
  DeviceDesktop,
  Clock,
  ArrowLeft,
  LetterH,
  Cpu2,
  BrandPatreon,
  PlayerPlay,
  DeviceGamepad,
} from 'tabler-icons-react'

import toast, { Toaster } from 'react-hot-toast'
import { useHistory } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import {
  TimePlayedByDayThisWeek,
  CheckRunningProcess,
  Play,
  FindOne,
  FindAll,
} from '../../wailsjs/go/main/App'

import Tabler from './charts/tabler'
import { format } from 'date-fns'

var now = new Date()

let weekArray = [
  {
    today: format(now.getTime() + 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
    yesterday: format(now.getTime() - 0 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
  {
    today: format(now.getTime() + 0 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
    yesterday: format(now.getTime() - 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
  {
    today: format(now.getTime() - 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
    yesterday: format(now.getTime() - 2 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
  {
    today: format(now.getTime() - 2 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
    yesterday: format(now.getTime() - 3 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
  {
    today: format(now.getTime() - 3 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
    yesterday: format(now.getTime() - 4 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
  {
    today: format(now.getTime() - 4 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
    yesterday: format(now.getTime() - 5 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
  {
    today: format(now.getTime() - 5 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
    yesterday: format(now.getTime() - 6 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
]

function GameDetails() {
  let history = useHistory()
  const { t, i18n } = useTranslation()

  const [isOpen, setIsOpen] = useState(true)

  const [apps, setApps] = useState([])

  const [tableData, setTableData] = useState([])

  const [playedHoursWeek, setPlayedHoursWeek] = useState()

  const [gameData, setGameData] = useState([])

  const [gameInfo, setGameInfo] = useState([])

  const [running, setRunning] = useState(false)

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const handlePlay = async () => {
    Play(
      localStorage.getItem('gameExecutable'),
      localStorage.getItem('gamePath'),
    )

    const now = new Date()

    let today = format(now.getTime() + 0 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')
    let tomorrow = format(now.getTime() + 1 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')

    CheckRunningProcess(
      localStorage.getItem('gameExecutable'),
      parseInt(localStorage.getItem('gameId')),
      today,
      tomorrow,
    )

    toast.success(t('toastRunning') + ' ' + localStorage.getItem('gameName'))

    await handleFindOne(parseInt(localStorage.getItem('gameId')))
  }

  const secondsToHours = (e) => {
    var h = Math.floor(e / 3600)
      .toString()
      .padStart(1, '0')
    var m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(1, '0')
    var s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0')

    return h + 'h' + ' ' + m + 'm'
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

    return h + 'h ' + m + 'm'
  }

  const getDataByWeek = async () => {
    await TimePlayedByDayThisWeek(
      { today: weekArray[0].today, yesterday: weekArray[0].yesterday },
      { today: weekArray[1].today, yesterday: weekArray[1].yesterday },
      { today: weekArray[2].today, yesterday: weekArray[2].yesterday },
      { today: weekArray[3].today, yesterday: weekArray[3].yesterday },
      { today: weekArray[4].today, yesterday: weekArray[4].yesterday },
      { today: weekArray[5].today, yesterday: weekArray[5].yesterday },
      { today: weekArray[6].today, yesterday: weekArray[6].yesterday },
      parseInt(localStorage.getItem('gameId')),
    ).then((result) => {
      setTableData(
        [
          secondsToHours(result.countOne),
          secondsToHours(result.countTwo),
          secondsToHours(result.countThree),
          secondsToHours(result.countFour),
          secondsToHours(result.countFive),
          secondsToHours(result.countSix),
          secondsToHours(result.countSeven),
        ].reverse(),
      )

      setPlayedHoursWeek(
        secondsToHours(
          result.countOne +
            result.countTwo +
            result.countThree +
            result.countFour +
            result.countFive +
            result.countSix +
            result.countSeven,
        ),
      )
    })
  }

  const handleFindOne = async (gameId) => {
    await FindOne(parseInt(gameId)).then((result) => {
      console.log(result)
      setGameInfo(result)
      setRunning(result.Running)
    })
  }

  const handleFindAll = async () => {
    await FindAll().then((result) => {
      setApps(result)
    })
  }

  const MINUTE_MS = 20000
  useEffect(() => {
    window.scrollTo(0, 0)
    handleFindAll()
    setGameData([localStorage.getItem('gameName')])

    handleFindOne(localStorage.getItem('gameId'))
    getDataByWeek()

    const interval = setInterval(() => {
      getDataByWeek()
      handleFindOne(localStorage.getItem('gameId'))
    }, MINUTE_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ overflow: 'scroll', overflowX: 'hidden' }}>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        enableOverlay={false}
        direction="left"
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
            background: 'transparent',
            color: 'white',
            height: '38px',
            width: '5px',
            float: 'left',
          }}
        ></div>
        <Button
          className="btnIconHover"
          style={{
            color: '#D9D9D9',
            float: 'left',
            marginLeft: '40px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => history.push('/gamesstats')}
        >
          <DeviceAnalytics
            className="iconHover"
            size={30}
            strokeWidth={1}
            // color={'#D9D9D9'}
            style={{ marginTop: '-6px' }}
          />{' '}
          {t('stats')}{' '}
        </Button>

        <br></br>
        <br></br>
        <Button
          className="btnIconHover"
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
            className="iconHover"
            size={30}
            strokeWidth={1}
            // color={'#D9D9D9'}
            style={{ marginTop: '-6px' }}
          />{' '}
          HowLongToBeat
        </Button>

        <br></br>
        <br></br>
        <Button
          className="btnIconHover"
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
            className="iconHover"
            size={30}
            strokeWidth={1}
            // color={'#D9D9D9'}
            style={{ marginTop: '-6px' }}
          />{' '}
          {t('pcSpecs')}
        </Button>

        <br></br>
        <br></br>
        <Button
          className="btnIconHover"
          style={{
            color: '#D9D9D9',
            float: 'left',
            marginLeft: '49px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => openPatreon()}
        >
          <BrandPatreon
            className="iconHover"
            size={28}
            strokeWidth={1}
            // color={'white'}
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
          v1.7.0
        </div>
      </Drawer>
      <Container className="Container">
        <br></br>
        <br></br>
        <div className="Content">
          <Button
            variant="outline-primary"
            style={{
              float: 'left',
              color: 'white',
              marginLeft: '0px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'white',
            }}
            onClick={() => history.push('/allgames')}
          >
            <ArrowLeft size={30} strokeWidth={1} color={'white'} />
          </Button>

          <br></br>
          <br></br>
          <br></br>
          <h3 className="title" style={{ color: '#ffffff', fontSize: '35px' }}>
            {gameData[0]}
          </h3>
          {/* <h5 className="title" style={{ color: '#ffffff', fontSize: '16px' }}>
                        {t('totalPlayTime')}
                    </h5>
                    <h3 className="title" style={{ color: '#ffffff', fontSize: '23px' }}>
                        <Clock
                            size={30}
                            strokeWidth={1}
                            color={'white'}
                            style={{ marginTop: '-6px' }}
                        />
                        {secondsToTime(gameInfo.Time)}
                    </h3> */}
          {/* <h3 className='title' style={{ color: '#ffffff', fontSize: '23px' }}>{format(new Date(gameInfo.UpdatedAt), 'yyyy/MM/dd hh:mm aaa')}</h3> */}
          {/* <br></br>
                    {running ? (
                        <Button
                            variant="success"
                            size="lg"
                            style={{
                                color: 'white',
                                borderColor: 'white',
                                width: '100%',
                            }}
                        // onClick={() =>
                        //   handlePlay(app.Executable, app.Path, app.Id)
                        // }
                        >
                            <DeviceGamepad
                                size={30}
                                strokeWidth={1}
                                color={'white'}
                                style={{ marginTop: '-5px' }}
                            />{' '}
                            {t('running')}
                        </Button>
                    ) : (
                        <Button
                            variant="outline-success"
                            size="lg"
                            style={{
                                color: 'white',
                                borderColor: 'white',
                                width: '100%',
                            }}
                            onClick={() => handlePlay()}
                        >
                            <PlayerPlay
                                size={30}
                                strokeWidth={1}
                                color={'white'}
                                style={{ marginTop: '-5px' }}
                            />{' '}
                            {t('play')}
                        </Button>
                    )} */}

          <br></br>

          <Row xs={2} md={2} className="g-4">
            <Col style={{ height: '100px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={secondsToTime(gameInfo.Time)}
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
                value={tableData[6]}
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
                value={playedHoursWeek}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('playedLastWeek')}
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
                value={new Date(gameInfo.UpdatedAt).toLocaleString(`en-US`, {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('lastTimePlayed')}
                fetching={false}
                error={null}
                icon={<Clock size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>
          </Row>

          <br></br>
          <br></br>

          <h5 className="title" style={{ color: '#ffffff', fontSize: '20px' }}>
            {t('timeByDayForTheLastWeek')}
          </h5>
          <br></br>
          <Row xs={2} md={1} className="g-4">
            <Col>
              <Tabler tableDatas={tableData} />
            </Col>
          </Row>
        </div>
      </Container>
      {/* <ToastContainer /> */}
      <Toaster />
    </div>
  )
}

export default GameDetails
