import { Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './auth/ChangePassword';
import { useLogoutUserMutation, useGetLoggedUserQuery } from '../services/userAuthApi';
import { getToken, removeToken } from '../services/LocalStorageService';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo, unsetUserInfo } from '../features/userSlice';
import { unsetUserToken } from '../features/authSlice';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: ""
  })

  const navigate = useNavigate()
  const token = getToken()
  const [logoutUser] = useLogoutUserMutation()
  const { data, isSuccess } = useGetLoggedUserQuery(token)
  console.log(data)

  const handleLogout = async () => {
    const res = await logoutUser({ token })
    if (res.data.status === "success") {
      dispatch(unsetUserToken({ token: null }))
      dispatch(unsetUserInfo({ email: "", name: "" }))
      removeToken('token')
      navigate('/login')
    }
  }

  // Store User Data in Local State
  useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        email: data.user.email,
        name: data.user.name,
      })
    }
  }, [data, isSuccess])

  // Store User Data in Redux Store
  const dispatch = useDispatch()
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.user.email,
        name: data.user.name,
      }))
    }
  }, [data, isSuccess, dispatch])


  return <>
    <CssBaseline />
    <Grid container>
      <Grid item sm={4} sx={{ backgroundColor: 'gray', p: 5, color: 'white' }}>
        <h1>Dashboard</h1>
        <Typography variant='h5'>Email: {userData.email}</Typography>
        <Typography variant='h6'>Name: {userData.name}</Typography>
        <Button variant='contained' color='warning' size='large' onClick={handleLogout} sx={{ mt: 8 }}>Logout</Button>
      </Grid>
      <Grid item sm={8}>
        <ChangePassword />
      </Grid>
    </Grid>
  </>;
};

export default Dashboard;
