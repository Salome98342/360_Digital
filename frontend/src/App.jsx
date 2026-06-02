import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
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
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
