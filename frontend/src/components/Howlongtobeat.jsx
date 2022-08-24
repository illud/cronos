import React, { useRef, useState, useEffect } from 'react'
// import Modal from 'react-modal';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import './Main.css'
// import Menu from './Menu';
import Drawer from 'react-modern-drawer'
import {
  DeviceAnalytics,
  DeviceDesktop,
  Clock,
  Search,
  LetterH,
  CirclePlus,
} from 'tabler-icons-react'
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { FindAll, HowlongtobeatRequest } from '../../wailsjs/go/main/App'

// import { HowLongToBeatService } from "howlongtobeat";
// const hltbService = new HowLongToBeatService();

// import howlongtobeat from 'howlongtobeat-api'

function Howlongtobeat() {
  let history = useHistory()
  const { t, i18n } = useTranslation()

  const [searchInput, setSearchInput] = useState('')

  const [apps, setApps] = useState([])

  const [howlongtobeatData, setHowlongtobeat] = useState([])

  const inputRef = useRef()

  const [isOpen, setIsOpen] = useState(true)

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const handleSearch = async (search) => {
    setSearchInput(search)
  }

  const handleSearchBtn = async () => {
    await HowlongtobeatRequest(searchInput).then((result) => {
      if (result || result === null) {
        if (result === null) {
          toast.error(t('noResultsFound'))
          setHowlongtobeat([])
        } else {
          if (result.length > 0) {
            setHowlongtobeat(result)
          } else {
            toast.error(t('noResultsFound'))
            setHowlongtobeat([])
          }
        }
      } else {
        toast.error(t('internetCon'))
      }
    })
  }

  const handleFindAll = async () => {
    await FindAll().then((result) => {
      setApps(result)
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    handleFindAll()

    handleSearchBtn()
  }, [])

  return (
    <div>
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
          onClick={() => history.push('/gamesstats')}
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
        <div
          style={{
            background: '#006FE8',
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
          V1.3.0
        </div>
      </Drawer>
      <Container className="Container">
        <br></br>
        <br></br>
        <div className="Content">
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            className="SearchInput"
            style={{
              float: 'left',
              color: 'white',
              marginLeft: '5px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'white',
              width: '40%',
              height: '43px',
            }}
            placeholder={t('searchGame')}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchInput}
          />
          <Button
            variant="outline-primary"
            style={{
              float: 'left',
              color: 'white',
              marginLeft: '0px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'white',
            }}
            onClick={() => handleSearchBtn()}
          >
            <Search size={30} strokeWidth={1} color={'white'} />
          </Button>
          <br></br>
          <br></br>
          <a style={{ color: '#FFFFFF', float: 'left', marginLeft: '5px' }}>
            Hours data sourced from{' '}
            <a
              style={{ color: '#FFFFFF' }}
              href="https://howlongtobeat.com/"
              target="_blank"
            >
              HowLongToBeat.
            </a>
          </a>
          {/* <Button variant="outline-primary" ariant="primary" onClick={() => handleFindAll()}>Asd</Button> */}

          <br></br>
          <br></br>

          <Row xs={2} md={2} className="g-4">
            {howlongtobeatData.map((howlongtobeat, index) => (
              <Col key={index}>
                <Card className="Cards" style={{ flexDirection: 'row' }}>
                  <Card.Img
                    variant="top"
                    style={{ width: '45%' }}
                    src={howlongtobeat.image}
                  />

                  {/* <Card.Img variant="top" src="https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg?t=1634172952" /> */}
                  <Card.Body style={{ marginTop: '-30px' }}>
                    <br></br>
                    <Card.Title style={{ color: 'white' }}>
                      {howlongtobeat.title}
                    </Card.Title>
                    <Card.Text style={{ color: 'white' }}>
                      {t('gameplayMain')} <br></br>
                      <a style={{ fontSize: '20px' }}>{howlongtobeat.main}h</a>
                    </Card.Text>
                    <Card.Text style={{ color: 'white' }}>
                      {t('gameplayMainExtra')} <br></br>
                      <a style={{ fontSize: '20px' }}>{howlongtobeat.extra}h</a>
                    </Card.Text>
                    <Card.Text style={{ color: 'white' }}>
                      {t('gameplayCompletionist')} <br></br>
                      <a style={{ fontSize: '20px' }}>
                        {howlongtobeat.completionist}h
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
                <br></br>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      {/* <ToastContainer /> */}
      <Toaster />
    </div>
  )
}

export default Howlongtobeat
