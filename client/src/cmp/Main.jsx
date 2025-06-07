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
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1>Welcome to the shelters API</h1>
       <MapView imageUrl="../Holon.png" />
    </div>
  )
}
