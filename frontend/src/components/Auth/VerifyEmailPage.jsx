import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reset, verifyEmail, resendEmailVerification } from '../../features/auth/authSlice';
import Spinner from '../../components/common/Spinner';
import { Container, Button, Card, Form } from "react-bootstrap";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const { isLoading, verified, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token))
        .unwrap()
        .then(() => {
          toast.success('Email verified successfully.');
          navigate('/login');
        })
        .catch(error => {
          toast.error(error.message || 'Failed to verify email.');
          navigate('/verify-email'); // Redirect back to verification page
        });
    }
  }, [dispatch, token, navigate]);

  const onResendEmail = async () => {
    try {
      // Pass the user's email to the action
      await dispatch(resendEmailVerification({ email: user.email }));
      setIsError(false);
      setIsSuccess(true);
      setMessage('Verification email sent successfully.');
    } catch (error) {
      setIsError(true);
      setIsSuccess(false);
      setMessage(error.message || 'Failed to send verification email.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <Container id="main-container" className="d-grid h-100 w-50">
        <Card className="my-5">
          <Card.Header>
            <h1 className="mb-3 fs-3 fw-normal my-3">
              Email Verification
            </h1>
          </Card.Header>
          <Card.Body>
            <p>
              You need to be logged in to verify your email. Please proceed to the login page.
            </p>
            <Form.Group>
              <div className="d-grid">
                <Button variant="info" size="lg" onClick={() => navigate('/login')}>Go to Login</Button>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
      </Container>
    );
  }  

  if (verified) {
    // Update this part to show a message that the email is already verified
    return (
      <Container id="main-container" className="d-grid h-100 w-50">
        <Card className="my-5">
          <Card.Header>
            <h1 className="mb-3 fs-3 fw-normal my-3">Email Verified</h1>
          </Card.Header>
          <Card.Body>
            <p>Your email has already been verified. Please proceed to the login page.</p>
            <Form.Group>
              <div className="d-grid">
                <Button variant="info" size="lg" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container id="main-container" className="d-grid h-100 w-50">
      <Card className="my-5">
        <Card.Header>
          <h1 className="mb-3 fs-3 fw-normalmy-3">
            Email Verification
          </h1>
        </Card.Header>
        <Card.Body>
          <p>
            Please check your email for a verification link. If you did not receive the email, you can click the button below to resend the verification email.
          </p>
          <Form.Group>
            <div className="d-grid">
              <Button variant="info" size="lg" onClick={onResendEmail} disabled={isLoading}>
                {isLoading ? "Resending..." : "Resend Email"}
              </Button>
            </div>
          </Form.Group>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default VerifyEmailPage;
