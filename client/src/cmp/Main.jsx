import {React, useEffect, useState} from 'react'
import axios from 'axios'

import MapView from './MapView'
export default function Main() {
  const [shelters, setShelters] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/shelters/list').then((res) => {
      setShelters(res.data ? res.data : []);
    }).catch((err) => {
      setShelters([]);
      console.log(err)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
        <img src="../Main_Logo.png" alt="Shelter Logo" style={{ width: '600px', height: '180px' }} />
      </div>
      <div style={{ paddingTop: '200px', flexGrow: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <MapView imageUrl="../Holon.png" />
      </div>
    </div>
  )
}