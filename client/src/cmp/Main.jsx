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
      <h2>List of shelters</h2>
      {/* <ul>
        {shelters.map((shelter) => (
          <li key={shelter.id}>
            {shelter.name} - {shelter.location}
          </li>
        ))}
      </ul> */}
       <MapView imageUrl="../HIT1.png" />
    </div>
  )
}
