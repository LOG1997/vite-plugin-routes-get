import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter } from "react-router-dom";

// import 'virtual:routes-get';
// import { AliveScope } from 'react-activation'
import { Router } from '@/router'
// import App from './views/App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
)
