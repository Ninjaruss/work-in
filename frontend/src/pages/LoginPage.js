import React from "react";
import { Container, Button, Card, Row, Form} from "react-bootstrap";

const LoginPage = () => {
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
                    <Form id="sign-in-form" className="text-center p-3 w-100">
                        <h4 className="text-start">EMAIL</h4>
                        <Form.Group className="my-1" controlId="sign-in-email-address">
                            <Form.Control type="email" size="lg" placeholder="email" autoComplete="username" className="position-relative" />
                        </Form.Group>
                        <h4 className="text-start m">PASSWORD</h4>
                        <Form.Group controlId="sign-in-password">
                            <Form.Control type="password" size="lg" placeholder="password" autoComplete="current-password" className="position-relative" />
                        </Form.Group>
                        <Form.Group className="d-flex mb-4" controlId="remember-me">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="info" size="lg" type="submit">Sign in</Button>
                        </div>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <div class="d-flex justify-content-center links">
                        Don't have an account?<a href="#">Sign Up</a>
                    </div>
                    <div class="d-flex justify-content-center">
                        <a href="#">Forgot your password?</a>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    )
}

export default LoginPage