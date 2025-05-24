import React from 'react'
import Card from '@mui/material/Card';

export default function UploadContainer() {
  return (
    <div>
        <Card sx={{ minWidth: 275 }}>
            <h1>Upload Container</h1>
            <h2>Upload your files here</h2>
            <input type="file" accept="image/*" />
            <button type="submit">Upload</button>
        </Card>
    </div>
  )
}
