import React from "react";
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register, reset } from '../../features/auth/authSlice'
import Spinner from '../../components/common/Spinner'
import { Container, Button, Card, Row, Col, Form} from "react-bootstrap";

function RegisterPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password2: ''
    })
    
    const {first_name, last_name, email, phone, password, password2} = formData
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
    )

    useEffect(() => {
    if (isError) {
        toast.error(message)
    }

    if (isSuccess || user) {
        navigate('/verify-email') // Update to the verification page route
    }

    dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (password !== password2) {
            toast.error('Passwords do not match')
        } else {
            const userData = {
                first_name, last_name, email, phone, password, password2
            }

            dispatch(register(userData))
        }
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
                        <h4 className="text-start">FIRST NAME</h4>
                        <Form.Group controlId="first_name" className="my-1">
                            <Form.Control type="text" size="lg" placeholder="Your first name" onChange={onChange} name="first_name" value={first_name} className="position-relative" required/>
                        </Form.Group>
                        <h4 className="text-start">LAST NAME</h4>
                        <Form.Group controlId="last_name" className="my-1">
                            <Form.Control type="text" size="lg" placeholder="Your last name" onChange={onChange} name="last_name" value={last_name} className="position-relative" required/>
                        </Form.Group>
                        <Row>
                            <Col>
                                <h4 className="text-start">EMAIL</h4>
                                <Form.Group controlId="email" className="my-1">
                                    <Form.Control type="email" size="lg" placeholder="Enter your email" onChange={onChange} name="email" value={email} className="position-relative" />
                                </Form.Group>
                            </Col>
                            <Col xs={1}>
                                <h4 className="d-flex justify-content-center">OR</h4>
                            </Col>
                            <Col>
                                <h4 className="text-start">PHONE</h4>
                                <Form.Group controlId="phone" className="my-1">
                                    <Form.Control type="text" size="lg" placeholder="Enter your phone number" onChange={onChange} name="phone" value={phone} className="position-relative" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <h4 className="text-start">PASSWORD</h4>
                        <Form.Group controlId="password">
                            <Form.Control type="password" size="lg" placeholder="Enter password" onChange={onChange} name="password" value={password} className="position-relative" required/>
                        </Form.Group>
                        <h4 className="text-start">CONFIRM PASSWORD</h4>
                        <Form.Group controlId="password2">
                            <Form.Control type="password" size="lg" placeholder="Confirm password" onChange={onChange} name="password2" value={password2} className="position-relative" required/>
                        </Form.Group>
                        <Form.Group>
                            <div className="d-grid">
                                <Button variant="info" size="lg" type="submit">Sign Up</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
                <Card.Footer>
                  <div class="d-flex justify-content-center links">
                      Already have an account?<a href="/login">Sign in</a>
                  </div>
              </Card.Footer>
            </Card>
        </Container>
    )
}

export default RegisterPage