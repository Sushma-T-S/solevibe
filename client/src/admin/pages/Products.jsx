import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProductAdmin from '../../pages/ProductAdmin'
import isAdmin from '../../utils/isAdmin'
import toast from 'react-hot-toast'

const Products = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user._id && !isAdmin(user.role)) {
      toast.error("Access denied. Admin only.")
      navigate('/')
    }
  }, [user])

  if (!isAdmin(user.role)) {
    return null
  }

  return <ProductAdmin />
}

export default Products
