import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import Navbar from '../components/Navbar'
import AsideBar from '../components/AsideBar'
import Footer from '../components/Footer'

const MyTasks = ({ isDark, toggleTheme }) => {

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    async function fetchMyTasks() {
        try {
            const res = await axiosInstance.get('/assignTask/my_tasks')
            setTasks(res.data.tasks)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleStatusChange(task_id, status) {
        try {
            await axiosInstance.patch(`/tasks/updateTaskStatus/${task_id}`, { status })
            alert('Status updated!')
            fetchMyTasks()
        } catch (err) {
            alert(err.response?.data?.msg || 'Something went wrong')
        }
    }

    useEffect(() => {
        fetchMyTasks()
    }, [])

    const getBadgeColor = (status) => {
        if (status === 'completed') return '#28a745'
        if (status === 'inprogress') return '#ffc107'
        return '#6c757d'
    }

    const getPriorityColor = (priority) => {
        if (priority === 'high') return '#dc3545'
        if (priority === 'medium') return '#ffc107'
        return '#6c757d'
    }

    const inputStyle = {
        backgroundColor: isDark ? '#0f0f1a' : '#fff',
        border: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
        color: isDark ? '#fff' : '#000'
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: isDark ? '#0f0f1a' : '#ffffff'
        }}>
            <Navbar toggleTheme={toggleTheme} isDark={isDark} />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-2" style={{
                        backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa',
                        minHeight: 'calc(100vh - 60px)',
                        borderRight: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`
                    }}>
                        <AsideBar isDark={isDark} />
                    </div>

                    <div className="col-10" style={{ padding: '30px', color: isDark ? '#fff' : '#000' }}>
                        <h3 className="mb-4">My Tasks</h3>

                        {loading ? (
                            <p>Loading...</p>
                        ) : tasks.length === 0 ? (
                            <p>No tasks assigned yet!</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ color: isDark ? '#fff' : '#000' }}>
                                    <thead>
                                        <tr style={{
                                            backgroundColor: isDark ? '#2e2e4f' : '#f8f9fa',
                                            color: isDark ? '#fff' : '#000'
                                        }}>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Change Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((item, index) => (
                                            <tr key={index} style={{
                                                backgroundColor: isDark ? '#1a1a2e' : '#fff',
                                                color: isDark ? '#fff' : '#000'
                                            }}>
                                                <td>{index + 1}</td>
                                                <td>{item.Task?.title}</td>
                                                <td>{item.Task?.description}</td>
                                                <td>
                                                    <span className="badge" style={{
                                                        backgroundColor: getPriorityColor(item.Task?.priority)
                                                    }}>
                                                        {item.Task?.priority}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge" style={{
                                                        backgroundColor: getBadgeColor(item.Task?.status)
                                                    }}>
                                                        {item.Task?.status}
                                                    </span>
                                                </td>
                                                <td>{item.Task?.startDate?.slice(0, 10)}</td>
                                                <td>{item.Task?.endDate?.slice(0, 10)}</td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{ ...inputStyle, minWidth: '120px' }}
                                                        defaultValue={item.Task?.status}
                                                        onChange={(e) => handleStatusChange(item.task_id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="inprogress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer isDark={isDark} />
        </div>
    )
}

export default MyTasks