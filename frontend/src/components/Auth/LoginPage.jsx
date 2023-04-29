import React from "react";
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Container, Col, Button, Card, Row, Form} from "react-bootstrap";
import Spinner from '../../components/common/Spinner'

import { login, reset } from '../../features/auth/authSlice'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  })

  const { email, phone, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, verified, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/home')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      phone,
      password,
    }

    dispatch(login(userData)).then((response) => {
      // Check if login was successful, otherwise show error toast
      if (response.payload && response.payload.error) {
        toast.error(response.payload.message);
      } else {
        if (response.payload.verified === false) {
          // Route to verify-email page if verified is false
          // Handle case when login fails due to user not being verified
          if (isError && message === "User not verified") {
            navigate("/verify-email");
          }
        } else {
          // Route to home page if verified is true
          navigate("/home");
        }
      }
    });
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
      <Container id="main-container" className="d-grid h-100 w-50">
          <Card className="my-5">
              <Card.Header>
                  <h1 className="mb-3 fs-3 fw-normal my-3">
                      <img
                      alt=""
                      src="https://w7.pngwing.com/pngs/652/289/png-transparent-red-and-white-document-bag-art-computer-icons-hamburger-button-experience-organization-icon-design-work-miscellaneous-service-logo.png"
                      width="32.5"
                      height="32.5"
                      className="d-inline-block align-top"
                      />{' '}
                      Work-in
                  </h1>
              </Card.Header>
              <Card.Body>
                  <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={onSubmit}>
                    <Row>
                      <Col>
                        <Form.Group controlId="email" className="my-1">
                            <h4 className="text-start" >EMAIL</h4>
                            <Form.Control type="email" size="lg" name='email' value={email} placeholder="Enter your email address" className="position-relative" onChange={onChange}/>
                        </Form.Group>
                      </Col>
                      <Col xs={1}>
                        <h4 className="d-flex justify-content-center">OR</h4>
                      </Col>
                      <Col>
                        <Form.Group controlId="phone" className="my-1">
                          <h4 className="text-start">PHONE</h4>
                          <Form.Control type="text" size="lg" name='phone'  value={phone} placeholder="Enter your phone number" className="position-relative" onChange={onChange}/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="password">
                      <h4 className="text-start">PASSWORD</h4>
                      <Form.Control type="password" size="lg" name='password' placeholder="Enter your password" className="position-relative" onChange={onChange}/>
                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="info" size="lg" type="submit">Sign in</Button>
                    </div>
                  </Form>
              </Card.Body>
              <Card.Footer>
                  <div class="d-flex justify-content-center links">
                      Don't have an account?<Link to="/register">Sign Up</Link>
                  </div>
              </Card.Footer>
          </Card>
      </Container>
  )
}

export default LoginPage