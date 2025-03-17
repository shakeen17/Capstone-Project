import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const handleAddScrum = async (values, { resetForm }) => {
        try {
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                name: values.scrumName,
            });

            const newScrum = newScrumResponse.data;

            await axios.post('http://localhost:4000/tasks', {
                title: values.taskTitle,
                description: values.taskDescription,
                status: values.taskStatus,
                scrumId: newScrum.id,
                assignedTo: values.taskAssignedTo,
                history: [
                    {
                        status: values.taskStatus,
                        date: new Date().toISOString().split('T')[0],
                    },
                ],
            });

            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);
            setShowForm(false);
            resetForm();
        } catch (error) {
            console.error('Error adding scrum:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        scrumName: Yup.string()
            .required('Scrum Name is required')
            .min(3, 'Scrum Name must be at least 3 characters'),
        taskTitle: Yup.string()
            .required('Task Title is required')
            .min(3, 'Task Title must be at least 3 characters'),
        taskDescription: Yup.string()
            .required('Task Description is required')
            .min(5, 'Task Description must be at least 5 characters'),
        taskStatus: Yup.string().required('Task Status is required'),
        taskAssignedTo: Yup.string().required('Assigning a user is required'),
    });

    return (
        <div>
            <h2>Scrum Teams</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>
                    {showForm && (
                        <Formik
                            initialValues={{
                                scrumName: '',
                                taskTitle: '',
                                taskDescription: '',
                                taskStatus: 'To Do',
                                taskAssignedTo: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleAddScrum}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div>
                                        <label>Scrum Name:</label>
                                        <Field type="text" name="scrumName" />
                                        <ErrorMessage name="scrumName" component="div" style={{ color: 'red' }} />
                                    </div>
                                    <div>
                                        <label>Task Title:</label>
                                        <Field type="text" name="taskTitle" />
                                        <ErrorMessage name="taskTitle" component="div" style={{ color: 'red' }} />
                                    </div>
                                    <div>
                                        <label>Task Description:</label>
                                        <Field type="text" name="taskDescription" />
                                        <ErrorMessage name="taskDescription" component="div" style={{ color: 'red' }} />
                                    </div>
                                    <div>
                                        <label>Task Status:</label>
                                        <Field as="select" name="taskStatus">
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </Field>
                                        <ErrorMessage name="taskStatus" component="div" style={{ color: 'red' }} />
                                    </div>
                                    <div>
                                        <label>Assign To:</label>
                                        <Field as="select" name="taskAssignedTo">
                                            <option value="">Select a user</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="taskAssignedTo" component="div" style={{ color: 'red' }} />
                                    </div>
                                    <button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Scrum'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            )}
            <ul>
                {scrums.map((scrum) => (
                    <li key={scrum.id}>
                        {scrum.name}
                        <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                    </li>
                ))}
            </ul>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;
