import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import CatalogPaints from './pages/CatalogPaints'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/catalogo',
    element: <Catalog />
  },
  {
    path: '/producto/:id',
    element: <ProductDetail />
  },
  {
    path: '/nosotros',
    element: <About />
  },
  {
    path: '/contacto',
    element: <Contact />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    path: '/catalogo/CuadrosPersonalizados',
    element: <CatalogPaints />
  }
  
])

function App() {
  return <RouterProvider router={router} />
}

export default App
