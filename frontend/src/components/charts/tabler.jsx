import React, { useRef, useState, useEffect } from 'react'
// import Modal from 'react-modal';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import '../Main.css'
import Chart from 'react-apexcharts'

import Drawer from 'react-modern-drawer'
import {
  DeviceAnalytics,
  DeviceDesktop,
  Clock,
  ArrowLeft,
  LetterH,
  Cpu2,
  BrandPatreon,
} from 'tabler-icons-react'
import toast, { Toaster } from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Table from 'react-bootstrap/Table'

var d = new Date()
var day = d.getDay()

let daysArray = []

function Tabler({ tableDatas }) {
  const { t, i18n } = useTranslation()

  const [apps, setApps] = useState([])

  if (day == 1) {
    daysArray.push(t('tuesday'))
    daysArray.push(t('wednesday'))
    daysArray.push(t('thursday'))
    daysArray.push(t('friday'))
    daysArray.push(t('saturday'))
    daysArray.push(t('sunday'))
    daysArray.push(t('monday'))
  }
  if (day == 2) {
    daysArray.push(t('wednesday'))
    daysArray.push(t('thursday'))
    daysArray.push(t('friday'))
    daysArray.push(t('saturday'))
    daysArray.push(t('sunday'))
    daysArray.push(t('monday'))
    daysArray.push(t('tuesday'))
  }
  if (day == 3) {
    daysArray.push(t('thursday'))
    daysArray.push(t('friday'))
    daysArray.push(t('saturday'))
    daysArray.push(t('sunday'))
    daysArray.push(t('monday'))
    daysArray.push(t('tuesday'))
    daysArray.push(t('wednesday'))
  }
  if (day == 4) {
    daysArray.push(t('friday'))
    daysArray.push(t('saturday'))
    daysArray.push(t('sunday'))
    daysArray.push(t('monday'))
    daysArray.push(t('tuesday'))
    daysArray.push(t('wednesday'))
    daysArray.push(t('thursday'))
  }
  if (day == 5) {
    daysArray.push(t('saturday'))
    daysArray.push(t('sunday'))
    daysArray.push(t('monday'))
    daysArray.push(t('tuesday'))
    daysArray.push(t('wednesday'))
    daysArray.push(t('thursday'))
    daysArray.push(t('friday'))
  }
  if (day == 6) {
    daysArray.push(t('sunday'))
    daysArray.push(t('monday'))
    daysArray.push(t('tuesday'))
    daysArray.push(t('wednesday'))
    daysArray.push(t('thursday'))
    daysArray.push(t('friday'))
    daysArray.push(t('saturday'))
  }
  if (day == 0) {
    daysArray.push(t('monday'))
    daysArray.push(t('tuesday'))
    daysArray.push(t('wednesday'))
    daysArray.push(t('thursday'))
    daysArray.push(t('friday'))
    daysArray.push(t('saturday'))
    daysArray.push(t('sunday'))
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      style={{ overflow: 'scroll', overflowX: 'hidden', overflowY: 'hidden' }}
    >
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
            <th style={{ color: 'white', textAlign: 'left' }}>
              {daysArray[0]}
            </th>
            <th style={{ color: 'white', textAlign: 'left' }}>
              {daysArray[1]}
            </th>
            <th style={{ color: 'white', textAlign: 'left' }}>
              {daysArray[2]}
            </th>
            <th style={{ color: 'white', textAlign: 'left' }}>
              {daysArray[3]}
            </th>
            <th style={{ color: 'white', textAlign: 'left' }}>
              {daysArray[4]}
            </th>
            <th style={{ color: 'white', textAlign: 'left' }}>
              {daysArray[5]}
            </th>
            <th style={{ color: 'white', textAlign: 'left' }}>
              {daysArray[6]}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                color: 'white',
                fontSize: '18px',
                textAlign: 'left',
              }}
            >
              {tableDatas[0]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '18px',
                textAlign: 'left',
              }}
            >
              {tableDatas[1]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '18px',
                textAlign: 'left',
              }}
            >
              {tableDatas[2]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '18px',
                textAlign: 'left',
              }}
            >
              {tableDatas[3]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '18px',
                textAlign: 'left',
              }}
            >
              {tableDatas[4]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '18px',
                textAlign: 'left',
              }}
            >
              {tableDatas[5]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '18px',
                textAlign: 'left',
              }}
            >
              {tableDatas[6]}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default Tabler
