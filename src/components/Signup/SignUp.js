import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSignUp = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post('http://localhost:4000/users', {
        name: values.name,
        email: values.email,
        password: values.password,
        role: 'employee',
      });
      resetForm(); // Clear form after success
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSignUp}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Name Field */}
            <div>
              <label>Name:</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
            </div>

            {/* Email Field */}
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
            </div>

            {/* Password Field */}
            <div>
              <label>Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
