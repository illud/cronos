import React, { useRef, useState, useEffect } from 'react'
// import Modal from 'react-modal';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import './Main.css'
// import Menu from './Menu';
import Drawer from 'react-modern-drawer'
import {
  DeviceAnalytics,
  PlayerPlay,
  CirclePlus,
  DeviceDesktop,
  Clock,
  CircleDashed,
  X,
  Upload,
  CircleCheck,
  Pencil,
  DeviceGamepad,
} from 'tabler-icons-react'
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import {
  Play,
  CheckRunningProcess,
  Create,
  DeleteApp,
  FindAll,
  GameExePath,
  Update,
} from '../../wailsjs/go/main/App'

function Main() {
  let history = useHistory()
  const { t, i18n } = useTranslation()

  const [result, setResult] = useState(null)
  const [modalShow, setModalShow] = useState(false)
  const [modalEditShow, setModalEditShow] = useState(false)
  const [modalDeleteShow, setModalDeleteShow] = useState(false)
  const [file, setFile] = useState('')
  const [name, setName] = useState('')
  const [path, setPath] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [apps, setApps] = useState([])
  const [gameId, setGameId] = useState()
  const [gameName, setGameName] = useState()

  const [circleCheck, setCircleCheck] = useState('white')

  const inputRef = useRef()

  const [isOpen, setIsOpen] = useState(true)

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  function handleFile(event, value) {
    // setFile(value)
    const file = event.files[0]
    let time = new Date(file.lastModified)
    console.log(file)
    // setPath(inputRef.current.value)
    setFile(event.files[0].name)
  }

  const handlePlay = async (gameName, name, path, id) => {
    Play(name, path)

    CheckRunningProcess(name, parseInt(id))

    toast.success(t('toastRunning') + ' ' + gameName)

    await handleFindAll()
  }

  const handleCreate = async () => {
    if (name === '' || path === '' || file === '') {
      toast.error(t('toastPleaseFillAllFields'))
    } else {
      Create(name, path, file, 0)
      setTimeout(async () => {
        setFile('')
        setName('')
        setPath('')
        setCircleCheck('white')
        await handleFindAll()
      }, 500)

      setModalShow(false)
      toast.success(t('toastSuccessfulCreation'))
    }
  }

  const handleFindFile = async () => {
    await GameExePath().then((result) => {
      const exe = result.split('\\')[result.split('\\').length - 1]
      setFile(exe)

      const removeExe = result.replace(exe, '')
      setPath(removeExe)

      setCircleCheck('green')
    })
  }

  const handleFindAll = async () => {
    await FindAll().then((result) => {
      setApps(result)
    })
  }

  const handleRemoveModal = async (id, name) => {
    setGameId(id)
    setGameName(name)
    setModalDeleteShow(true)
  }

  const handleEditModal = async (id, name, path, executable) => {
    setGameId(id)
    setName(name)
    setPath(path)
    setFile(executable)
    setCircleCheck('green')
    setModalEditShow(true)
  }

  const handleUpdate = async () => {
    if (name === '' || path === '' || file === '') {
      toast.error(t('toastPleaseFillAllFields'))
    } else {
      Update(parseInt(gameId), name, path, file)
      setTimeout(async () => {
        setFile('')
        setName('')
        setPath('')
        setCircleCheck('white')
        await handleFindAll()
      }, 500)

      setModalEditShow(false)
      toast.success(t('toastSuccessfulUpdate'))
    }
  }

  const handleDelete = async () => {
    DeleteApp(parseInt(gameId))
    setTimeout(async () => {
      await handleFindAll()
    }, 500)

    setModalDeleteShow(false)
    toast.success(t('toastRemoved'))
  }

  const handleModalCreate = () => {
    setFile('')
    setName('')
    setPath('')
    setCircleCheck('white')
    setModalShow(true)
  }

  const handleSearch = (search) => {
    if (search === '' || search.length <= 0) {
      setSearchInput('')
      handleFindAll()
    } else {
      setSearchInput(search.toLowerCase())
      const matchedGames = apps.filter((value) => {
        return value.Name.toLowerCase().match(
          new RegExp(search.toLowerCase(), 'g'),
        )
      })
      setApps([])
      setApps(matchedGames)
    }
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

  const MINUTE_MS = 20000
  useEffect(() => {
    window.scrollTo(0, 0)
    handleFindAll()

    const interval = setInterval(() => {
      if (searchInput.length <= 0) {
        handleFindAll()
        setSearchInput('')
      }
    }, MINUTE_MS)
    return () => clearInterval(interval)
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
            background: 'white',
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
          V1.1.2
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
            onClick={() => handleModalCreate()}
          >
            <CirclePlus size={30} strokeWidth={1} color={'white'} /> {t('add')}
          </Button>
          <Button
            variant="outline-primary"
            style={{
              float: 'left',
              color: 'white',
              marginLeft: '5px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'white',
            }}
            onClick={() => handleFindAll()}
          >
            <CircleDashed size={30} strokeWidth={1} color={'white'} />{' '}
            {t('reload')}
          </Button>

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
          <br></br>

          {/* <Button variant="outline-primary" ariant="primary" onClick={() => handleFindAll()}>Asd</Button> */}
          <br></br>
          <br></br>

          <Row xs={2} md={3} className="g-4">
            {apps.map((app, index) => (
              <Col key={index}>
                <Card className="Cards">
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-primary"
                      style={{
                        // float: 'right',
                        // floatLeft: '-1200px',
                        // right: 0,
                        color: 'white',
                        borderColor: 'transparent',
                        width: '20%',
                        // position: 'absolute',
                      }}
                      onClick={() =>
                        handleEditModal(
                          app.Id,
                          app.Name,
                          app.Path,
                          app.Executable,
                        )
                      }
                    >
                      <Pencil
                        size={30}
                        strokeWidth={1}
                        color={'white'}
                        onClick={() =>
                          handleEditModal(
                            app.Id,
                            app.Name,
                            app.Path,
                            app.Executable,
                          )
                        }
                      />
                    </Button>
                    <Button
                      variant="outline-danger"
                      style={{
                        // float: 'right',
                        right: 0,
                        color: 'white',
                        borderColor: 'transparent',
                        width: '20%',
                        // position: 'absolute',
                      }}
                      onClick={() => handleRemoveModal(app.Id, app.Name)}
                    >
                      <X
                        size={30}
                        strokeWidth={1}
                        color={'white'}
                        onClick={() => handleRemoveModal(app.Id, app.Name)}
                      />
                    </Button>
                  </ButtonGroup>
                  {/* <Card.Img variant="top" src="https://cdn.cloudflare.steamstatic.com/steam/apps/924970/header.jpg?t=1649358821" /> */}

                  {/* <Card.Img variant="top" src="https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg?t=1634172952" /> */}
                  <Card.Body style={{ marginTop: '-30px' }}>
                    <br></br>
                    <Card.Title style={{ color: 'white' }}>
                      {app.Name}
                    </Card.Title>
                    <Card.Text style={{ color: 'white' }}>
                      {t('totalPlayTime')} <br></br>
                      <p style={{ fontSize: '20px' }}>
                        <Clock
                          size={30}
                          strokeWidth={1}
                          color={'white'}
                          style={{ marginTop: '-6px' }}
                        />
                        {secondsToTime(app.Time)}
                      </p>
                    </Card.Text>
                    <Card.Text style={{ color: 'white' }}>
                      {t('lastTimePlayed')}
                      <br></br>
                      {format(new Date(app.UpdatedAt), 'yyyy/MM/dd hh:mm aaa')}
                    </Card.Text>

                    {app.Running ? (
                      <Button
                        variant="outline-success"
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
                        onClick={() =>
                          handlePlay(app.Name, app.Executable, app.Path, app.Id)
                        }
                      >
                        <PlayerPlay
                          size={30}
                          strokeWidth={1}
                          color={'white'}
                          style={{ marginTop: '-5px' }}
                        />{' '}
                        {t('play')}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
                <br></br>
              </Col>
            ))}
          </Row>
        </div>
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            closeButton
            style={{ background: '#212121', color: 'white' }}
          >
            <Modal.Title id="contained-modal-title-vcenter">
              {t('addingNewGame')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background: '#212121',
              color: 'white',
              marginTop: '-1px',
            }}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* <Form.Label>Name</Form.Label> */}
              <Form.Control
                type="text"
                style={{
                  background: '#212121',
                  borderColor: 'grey',
                  color: 'white',
                }}
                placeholder={t('enterGameName')}
                onChange={(value) => setName(value.target.value)}
                value={name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              {/* <Form.Label>Executable</Form.Label>
							<Form.Control
								type="file"
								// ref={inputRef}
								style={{
									background: '#292929',
									borderColor: '292929',
									color: 'white',
								}}
								placeholder="Executable"

							//   value={file}
							/> */}
              <Button
                style={{
                  background: 'transparent',
                  borderColor: 'white',
                  width: '100%',
                }}
                onClick={() => handleFindFile()}
              >
                <Upload size={30} strokeWidth={1} color={'white'} />{' '}
                {t('gameExe')}{' '}
                <CircleCheck size={30} strokeWidth={1} color={circleCheck} />
              </Button>
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>
								Path Example(C:\games\DOOM Eternal\)
							</Form.Label>
							<Form.Control
								type="text"
								style={{
									background: '#292929',
									borderColor: 'grey',
									color: 'white',
								}}
								placeholder="Enter path"
								onChange={(value) => setPath(value.target.value)}
								value={path}
							/>
						</Form.Group> */}
          </Modal.Body>
          <Modal.Footer
            style={{
              background: '#212121',
              color: 'white',
              marginTop: '-1px',
            }}
          >
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => setModalShow(false)}
            >
              {t('closeBtn')}
            </Button>
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => handleCreate()}
            >
              {t('addBtn')}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={modalEditShow}
          onHide={() => setModalEditShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            closeButton
            style={{ background: '#212121', color: 'white' }}
          >
            <Modal.Title id="contained-modal-title-vcenter">
              {t('editing')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background: '#212121',
              color: 'white',
              marginTop: '-1px',
            }}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* <Form.Label>Name</Form.Label> */}
              <Form.Control
                type="text"
                style={{
                  background: '#212121',
                  borderColor: 'grey',
                  color: 'white',
                }}
                placeholder={t('enterGameName')}
                onChange={(value) => setName(value.target.value)}
                value={name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              {/* <Form.Label>Executable</Form.Label>
							<Form.Control
								type="file"
								// ref={inputRef}
								style={{
									background: '#292929',
									borderColor: '292929',
									color: 'white',
								}}
								placeholder="Executable"

							//   value={file}
							/> */}
              <Button
                style={{
                  background: 'transparent',
                  borderColor: 'white',
                  width: '100%',
                }}
                onClick={() => handleFindFile()}
              >
                <Upload size={30} strokeWidth={1} color={'white'} />{' '}
                {t('gameExe')}{' '}
                <CircleCheck size={30} strokeWidth={1} color={circleCheck} />
              </Button>
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>
								Path Example(C:\games\DOOM Eternal\)
							</Form.Label>
							<Form.Control
								type="text"
								style={{
									background: '#292929',
									borderColor: 'grey',
									color: 'white',
								}}
								placeholder="Enter path"
								onChange={(value) => setPath(value.target.value)}
								value={path}
							/>
						</Form.Group> */}
          </Modal.Body>
          <Modal.Footer
            style={{
              background: '#212121',
              color: 'white',
              marginTop: '-1px',
            }}
          >
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => setModalEditShow(false)}
            >
              {t('closeBtn')}
            </Button>
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => handleUpdate()}
            >
              {t('updateBtn')}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={modalDeleteShow}
          onHide={() => setModalDeleteShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          // style={{ opacity: 0.9, borderColor: 'transparent' }}
        >
          <Modal.Header
            closeButton
            style={{ background: '#212121', color: 'white' }}
          >
            <Modal.Title id="contained-modal-title-vcenter">
              {t('removing')} {gameName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background: '#212121',
              color: 'white',
              marginTop: '-1px',
            }}
          >
            <h5>{t('areYouDhureYouWantToRemoveTheGame')}</h5>
          </Modal.Body>
          <Modal.Footer
            style={{
              background: '#212121',
              color: 'white',
              marginTop: '-1px',
            }}
          >
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => setModalDeleteShow(false)}
            >
              {t('closeBtn')}
            </Button>
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => handleDelete()}
            >
              {t('removeBtn')}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      {/* <ToastContainer /> */}
      <Toaster />
    </div>
  )
}

export default Main
