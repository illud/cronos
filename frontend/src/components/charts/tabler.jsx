import React, { useEffect } from 'react'
import '../Main.css'

import { useTranslation } from 'react-i18next'
import Table from 'react-bootstrap/Table'

var d = new Date()
var day = d.getDay()

let daysArray = []

function Tabler({ tableDatas }) {
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
                fontSize: '20px',
                textAlign: 'left',
              }}
            >
              {tableDatas[0]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '20px',
                textAlign: 'left',
              }}
            >
              {tableDatas[1]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '20px',
                textAlign: 'left',
              }}
            >
              {tableDatas[2]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '20px',
                textAlign: 'left',
              }}
            >
              {tableDatas[3]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '20px',
                textAlign: 'left',
              }}
            >
              {tableDatas[4]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '20px',
                textAlign: 'left',
              }}
            >
              {tableDatas[5]}
            </td>
            <td
              style={{
                color: 'white',
                fontSize: '20px',
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
