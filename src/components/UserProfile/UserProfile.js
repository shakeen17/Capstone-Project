import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../../context/UserContext';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                if (user?.role === 'admin') {
                    setUsers(response.data.filter(user => user?.role !== 'admin'));
                } else {
                    setSelectedUser(user);
                    fetchTasks(user?.id);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleGetHistory = (userId) => {
        setSelectedUser(users.find(user => user?.id === userId));
        fetchTasks(userId);
    };

    const handleAddUser = async (values, { resetForm }) => {
        try {
            await axios.post('http://localhost:4000/users', {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
            });

            const updatedUsers = await axios.get('http://localhost:4000/users');
            setUsers(updatedUsers.data.filter(user => user?.role !== 'admin'));
            setShowForm(false); // Hide the form after submission
            resetForm();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name cannot exceed 50 characters'),
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email format'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password cannot exceed 20 characters'),
        role: Yup.string()
            .required('Role is required')
            .oneOf(['admin', 'employee'], 'Invalid role'),
    });

    return (
        <div>
            <h2>User Profiles</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New User'}
                    </button>

                    {showForm && (
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                role: 'employee',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleAddUser}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div>
                                        <label>Name:</label>
                                        <Field type="text" name="name" />
                                        <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                                    </div>

                                    <div>
                                        <label>Email:</label>
                                        <Field type="email" name="email" />
                                        <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                                    </div>

                                    <div>
                                        <label>Password:</label>
                                        <Field type="password" name="password" />
                                        <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                                    </div>

                                    <div>
                                        <label>Role:</label>
                                        <Field as="select" name="role">
                                            <option value="employee">Employee</option>
                                            <option value="admin">Admin</option>
                                        </Field>
                                        <ErrorMessage name="role" component="div" style={{ color: 'red' }} />
                                    </div>

                                    <button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create User'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}
                    
                    <ul>
                        {users.map(user => (
                            <li key={user?.id}>
                                <strong>Name:</strong> {user?.name} <br />
                                <strong>Email:</strong> {user?.email} <br />
                                <button onClick={() => handleGetHistory(user?.id)}>Get History</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {user?.role !== 'admin' && (
                <div>
                    <h3>Tasks Worked By {user?.name}</h3>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>
                                <strong>Title:</strong> {task.title} <br />
                                <strong>Description:</strong> {task.description} <br />
                                <strong>Status:</strong> {task.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedUser && user?.role === 'admin' && (
                <div>
                    <h3>Tasks Worked By {selectedUser.name}</h3>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>
                                <strong>Title:</strong> {task.title} <br />
                                <strong>Description:</strong> {task.description} <br />
                                <strong>Status:</strong> {task.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
