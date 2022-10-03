import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import './Main.css'
import Drawer from 'react-modern-drawer'
import {
  DeviceAnalytics,
  DeviceDesktop,
  Clock,
  LetterH,
  User,
  Cpu,
  Cpu2,
  Rectangle,
  Disc,
  RectangleVertical,
  BrandPatreon,
} from 'tabler-icons-react'
import { useHistory } from 'react-router-dom'
// import testedGamesJson from './testedgames.json'
import MetricCard from 'react-metric-card'
import 'react-metric-card/dist/index.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FindAll, Pcspecs } from '../../wailsjs/go/main/App'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

function PcSpecs() {
  let history = useHistory()
  const { t, i18n } = useTranslation()

  const [apps, setApps] = useState([])
  const [specs, setSpects] = useState({})
  const [isOpen, setIsOpen] = useState(true)

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const handleFindAll = async () => {
    await FindAll().then((result) => {
      setApps(result)
    })
  }

  const handleGetPcSpecs = async () => {
    await Pcspecs().then((result) => {
      console.log(result)
      setSpects(result)
    })
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
      await handleGetPcSpecs()
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
          className="btnIconHover"
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
            className="iconHover"
            size={30}
            strokeWidth={1}
            // color={'#D9D9D9'}
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
            marginLeft: '41px',
            background: 'transparent',
            borderColor: 'transparent',
          }}
          onClick={() => history.push('/pcspecs')}
        >
          <Cpu2
            size={30}
            strokeWidth={1}
            color={'white'}
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
      <div style={{ marginLeft: '320px' }}>
        <Container className="Container">
          <br></br>
          <br></br>

          <Row xs={6} md={2} className="g-4">
            <Col style={{ height: '110px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={specs.Hostname}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('Hostname')}
                fetching={false}
                error={null}
                icon={<User size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '110px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={specs.Platform}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('Platform')}
                fetching={false}
                error={null}
                icon={
                  <DeviceDesktop size={30} strokeWidth={1} color={'white'} />
                }
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '110px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={specs.MAINBOARD}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('MAINBOARD')}
                fetching={false}
                error={null}
                icon={
                  <RectangleVertical
                    size={30}
                    strokeWidth={1}
                    color={'white'}
                  />
                }
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '110px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={specs.RAM + ' GB'}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('RAM')}
                fetching={false}
                error={null}
                icon={<Rectangle size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '110px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={specs.CPU}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('CPU')}
                fetching={false}
                error={null}
                icon={<Cpu size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '110px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={specs.GPU}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('GPU')}
                fetching={false}
                error={null}
                icon={<Cpu2 size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>

            <Col style={{ height: '110px' }}>
              <MetricCard
                cardBgColor="rgba(0, 0, 0, 0.5)"
                titleColor="white"
                valueColor="white"
                value={specs.Disk + ' GB'}
                // trend={{
                // 	slope: 1,
                // 	description: 'Compared to last week',
                // 	value: '0.5%'
                // }}
                title={t('Disk')}
                fetching={false}
                error={null}
                icon={<Disc size={30} strokeWidth={1} color={'white'} />}
                iconBgColor="transparent"
                iconColor="transparent"
              />
            </Col>
          </Row>
          <br></br>
          <br></br>
        </Container>
      </div>
    </div>
  )
}

export default PcSpecs
