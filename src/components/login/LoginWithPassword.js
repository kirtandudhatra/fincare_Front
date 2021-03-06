/**
 * Author: Falgun Manishbhai Makadia (B00874635)
 * Description: Login with Password Component - For users to Login to FinCare with their Password
 * NOTE: By Default Login with Password Page will be loaded
 */
import React, { useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'
import './LoginPage.css'
import { Link } from 'react-router-dom'
import Notification from '../../components/Notifications/Notifications'
import { notificationTypes } from '../../constants'
import axios, { Routes } from '../../services/axios'

/**
 * Description: LoginWithPassword Functional Component
 */
const LogInWithPassword = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  /**
   * Description: Function to set Initial Component level State
   */
  const setInitErrorState = () => {
    setEmailError('')
    setPasswordError('')
  }

  /**
   * Description: Function to Validate Email using RegEx
   * @param {*} email
   * @returns {boolean}
   */
  const validateEmail = (email) => {
    const regex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
    if (!regex.test(email)) {
      return false
    }
    return true
  }

  /**
   * Description: Function to Validate Form
   * @returns {boolean}
   */
  const formValidator = () => {
    let emailError = ''
    let passwordError = ''

    if (email.trim().length === 0) {
      emailError = 'Email is Required!'
    } else if (email && !validateEmail(email.trim())) {
      emailError = 'Inalid Email ID'
    }

    if (password.length === 0) {
      passwordError = 'Password is Required!'
    }

    if (emailError || passwordError) {
      setEmailError(emailError)
      setPasswordError(passwordError)
      return false
    }
    return true
  }

  /**
   * Description: Function to Handle Form Submission
   * @param {*} e : Event
   */
  const submitHandler = async (e) => {
    e.preventDefault()
    const isValid = formValidator()
    if (isValid) {
      setInitErrorState()
      localStorage.setItem('loginStatus', true)
      history.push('/Dashboard')
      try {
        const { url, method } = Routes.api.loginUserWithPassword()
        const { data } = await axios[method](url, {
          email: email.toLowerCase(),
          password,
        })
        if (data.success) {
          Notification(notificationTypes.SUCCESS, 'Login Success!')
          localStorage.setItem('userId', data.data._id)
          localStorage.setItem('loginStatus', true)
          if (data.token) {
            localStorage.setItem('token', data.token)
          }
          history.push('/Dashboard')
          window.location.reload(false)
        } else {
          Notification(notificationTypes.ERROR, data.message)
        }
        setInitErrorState()
      } catch (err) {
        Notification(notificationTypes.ERROR, err)
      }
    }
  }

  return (
    <div className='d-flex justify-content-center'>
      <Card style={{ width: '22rem', marginTop: '2rem' }}>
        <Card.Body>
          <h1 style={{ textAlign: 'center' }} className='primary-color'>
            Login
          </h1>
          <hr />
          <Form className='justify-content-center' onSubmit={submitHandler}>
            <Form.Group className='mt-2 w-100'>
              <Form.Control
                type='text'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <div className='error'>{emailError}</div>
            <Form.Group className='mt-3 w-100'>
              <Form.Control
                type='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className='error'>{passwordError}</div>
            <br />
            <div className='mt-3 w-100 d-flex justify-content-around'>
              <Card.Link href='/login?mode=otp' className='primary-color'>
                Login With OTP
              </Card.Link>
              <Card.Link href='/forgotpassword/otp' className='primary-color'>
                Forgot Password
              </Card.Link>
            </div>
            <Button type='submit' className='mt-3 px-5 btn-primary'>
              Login
            </Button>
            <div style={{ textAlign: 'center' }} className='mt-3'>
              Don't have an account?{' '}
              <Link to='/register' className='primary-color'>
                Sign Up
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default LogInWithPassword
