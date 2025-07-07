import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App2 from './App2.jsx'
import App from "./App.jsx"
// import StarRating from './components/StarRating'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App2 /> */}
    <App/>
    {/* <StarRating maxRating={5}/>
    <StarRating maxRating={10}/> */}
  </StrictMode>,
)
