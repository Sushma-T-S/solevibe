import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CategoryPage from '../../pages/CategoryPage'
import isAdmin from '../../utils/isAdmin'
import toast from 'react-hot-toast'

const Categories = () => {
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

  return <CategoryPage />
}

export default Categories
