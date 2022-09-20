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
// import Menu from './Menu';
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
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

var today = new Date()
var dd = today.getDate()
var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
var yyyy = today.getFullYear()

today = yyyy + '-' + mm + '-' + dd

var d = new Date()
var day = d.getDay()

let daysArray = []

function Line({ serseriesFromParenties, anotationsFromParent }) {
  const { t, i18n } = useTranslation()

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

  const [options, setOptions] = useState({
    chart: {
      height: 400,
      foreColor: '#ffffff',
      type: 'line',
      id: 'areachart-2',
      zoom: {
        enabled: true,
      },
    },
    annotations: {
      points: anotationsFromParent,
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: t('timePlayedByDayThisWeek'),
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#ffffff', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.1,
      },
    },
    xaxis: {
      categories: daysArray,
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    console.log(anotationsFromParent)
  }, [anotationsFromParent])

  return (
    <div style={{ overflow: 'scroll', overflowX: 'hidden' }}>
      <Chart options={options} series={serseriesFromParenties} type="line" />
    </div>
  )
}

export default Line
