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
} from 'tabler-icons-react'
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import testedGamesJson from './testedgames.json'
import { format } from 'date-fns'

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
  const [result, setResult] = useState(null)
  const [modalShow, setModalShow] = useState(false)
  const [modalEditShow, setModalEditShow] = useState(false)
  const [modalDeleteShow, setModalDeleteShow] = useState(false)
  const [file, setFile] = useState('')
  const [name, setName] = useState('')
  const [path, setPath] = useState('')

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

  const handlePlay = (name, path, id) => {
    Play(name, path)

    CheckRunningProcess(name, parseInt(id))

    toast.success('Running')
  }

  const handleCreate = async () => {
    if (name === '' || path === '' || file === '') {
      toast.error('Please fill all fields')
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
      toast.success('Successful creation')
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
      toast.error('Please fill all fields')
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
      toast.success('Successful update')
    }
  }

  const handleDelete = async () => {
    DeleteApp(parseInt(gameId))
    setTimeout(async () => {
      await handleFindAll()
    }, 500)

    setModalDeleteShow(false)
    toast.success('Removed!')
  }

  const handleModalCreate = () => {
    setFile('')
    setName('')
    setPath('')
    setCircleCheck('white')
    setModalShow(true)
  }

  function secondsToTime(e) {
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

  const MINUTE_MS = 10000
  useEffect(() => {
    window.scrollTo(0, 0)
    handleFindAll()

    const interval = setInterval(() => {
      handleFindAll()
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
        <h4 style={{ color: 'white', marginTop: '30px', fontStyle: 'bold' }}>
          CRONOS
        </h4>

        <br></br>
        <hr style={{ color: 'white', height: '1px' }}></hr>
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
          <DeviceDesktop size={30} strokeWidth={1} color={'white'} /> All Games{' '}
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
          <DeviceAnalytics size={30} strokeWidth={1} color={'white'} /> Stats{' '}
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
          V1.0.0
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
            <CirclePlus size={30} strokeWidth={1} color={'white'} /> Add
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
            <CircleDashed size={30} strokeWidth={1} color={'white'} /> Reload
          </Button>
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
                      TOTAL PLAY TIME <br></br>
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
                      LAST TIME PLAYED
                      <br></br>
                      {format(new Date(app.UpdatedAt), 'yyyy/MM/dd hh:mm aaa')}
                    </Card.Text>
                    <Button
                      variant="outline-success"
                      size="lg"
                      style={{
                        color: 'white',
                        borderColor: 'white',
                        width: '100%',
                      }}
                      onClick={() =>
                        handlePlay(app.Executable, app.Path, app.Id)
                      }
                    >
                      <PlayerPlay
                        size={30}
                        strokeWidth={1}
                        color={'white'}
                        style={{ marginTop: '-5px' }}
                      />{' '}
                      Play
                    </Button>
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
              Adding new game
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
                placeholder="Enter game name"
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
                <Upload size={30} strokeWidth={1} color={'white'} /> GAME EXE{' '}
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
              Close
            </Button>
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => handleCreate()}
            >
              Add
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
              Editing
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
                placeholder="Enter game name"
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
                <Upload size={30} strokeWidth={1} color={'white'} /> GAME EXE{' '}
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
              Close
            </Button>
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => handleUpdate()}
            >
              Update
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
              Removing {gameName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background: '#212121',
              color: 'white',
              marginTop: '-1px',
            }}
          >
            <h5>¿Are you shure you want to remove the game?</h5>
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
              Close
            </Button>
            <Button
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
              onClick={() => handleDelete()}
            >
              Remove
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
