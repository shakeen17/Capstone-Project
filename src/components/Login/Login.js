import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const initialValues = {
    email: '',
    password: '',
  };

 
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Form submission logic
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users?email=${values.email}&password=${values.password}`
      );

      if (response.data.length > 0) {
        const user = response.data[0];
        login(user); // Save user to context

        if (user.role === 'admin') {
          navigate('/'); // Redirect admin to dashboard
        } else {
          navigate('/profiles'); // Redirect normal user to profiles
        }
      } else {
        alert('Invalid email or password'); // Invalid
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClick = () => {
    navigate('/signup'); 
  };

  return (
    <>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>

            {/* <div> */}
              <label>Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter email"
              />
              <ErrorMessage
                name="email"
                component="div"
                style={{ color: 'red' }}
              />
            {/* </div> */}

            {/* <div> */}
              <label>Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter password"
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: 'red' }}
              />
            {/* </div> */}

            {/* <div> */}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            {/* </div> */}
          </Form>
        )}
      </Formik>
      <button onClick={handleClick}>Sign Up</button>
    </>
  );
}

export default Login;
