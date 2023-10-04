import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Form from './Form'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-[100%] '>
      <MantineProvider

        theme={{
          fontFamily: 'Noto Sans Thai, sans-serif',
          fontFamilyMonospace: 'Noto Sans Thai, Noto Sans Thai',
          headings: { fontFamily: 'Noto Sans Thai, sans-serif' },
        }}
      >
        <Form />
      </MantineProvider>
    </div>
  )
}

export default App
