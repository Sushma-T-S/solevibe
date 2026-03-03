import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SubCategoryPage from '../../pages/SubCategoryPage'
import isAdmin from '../../utils/isAdmin'
import toast from 'react-hot-toast'

const SubCategories = () => {
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

  return <SubCategoryPage />
}

export default SubCategories
