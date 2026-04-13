import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import Navbar from '../components/Navbar'
import AsideBar from '../components/AsideBar'
import Footer from '../components/Footer'

const AllTasks = ({ isDark, toggleTheme }) => {

    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [assignedTasks, setAssignedTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterPriority, setFilterPriority] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const tasksPerPage = 10

    async function fetchAllTasks() {
        try {
            const res = await axiosInstance.get('/tasks/getAllTasks')
            setTasks(res.data.tasks)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function fetchAllUsers() {
        try {
            const res = await axiosInstance.get('/user/getAllUsers')
            setUsers(res.data.users)
        } catch (err) {
            console.error(err)
        }
    }

    async function fetchAssignedTasks() {
        try {
            const res = await axiosInstance.get('/assignTask/allTasksWithUser')
            setAssignedTasks(res.data.tasks)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleAssign(task_id, user_id) {
        try {
            const res = await axiosInstance.post('/assignTask/assign', { task_id, user_id })
            if (res.data.success) {
                alert(res.data.msg)
                fetchAssignedTasks()
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Something went wrong')
        }
    }

    function getAssignedUser(task_id) {
        const assigned = assignedTasks.find(a => a.task_id === task_id)
        return assigned?.User?.name || null
    }

    useEffect(() => {
        fetchAllTasks()
        fetchAllUsers()
        fetchAssignedTasks()
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

    const filteredTasks = tasks.filter(task => {
        const matchSearch = task.title?.toLowerCase().includes(search.toLowerCase()) ||
            task.description?.toLowerCase().includes(search.toLowerCase())
        const matchPriority = filterPriority ? task.priority === filterPriority : true
        const matchStatus = filterStatus ? task.status === filterStatus : true
        return matchSearch && matchPriority && matchStatus
    })

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage)
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
    )

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
                        <h3 className="mb-4">All Tasks</h3>

                        {/* Search + Filters */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-5">
                                <input
                                    type="text"
                                    placeholder="Search by title or description..."
                                    className="form-control"
                                    style={inputStyle}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                />
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    style={inputStyle}
                                    value={filterPriority}
                                    onChange={(e) => {
                                        setFilterPriority(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                >
                                    <option value="">All Priorities</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    style={inputStyle}
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="inprogress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="col-md-1">
                                <button
                                    className="btn w-100"
                                    style={{ backgroundColor: '#dc3545', color: '#fff' }}
                                    onClick={() => {
                                        setSearch('')
                                        setFilterPriority('')
                                        setFilterStatus('')
                                        setCurrentPage(1)
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <p>Loading...</p>
                        ) : filteredTasks.length === 0 ? (
                            <p>No tasks found!</p>
                        ) : (
                            <>
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
                                                <th>Assign To</th>
                                                <th>Change Priority</th>
                                                <th>Change Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedTasks.map((task, index) => (
                                                <tr key={index} style={{
                                                    backgroundColor: isDark ? '#1a1a2e' : '#fff',
                                                    color: isDark ? '#fff' : '#000'
                                                }}>
                                                    <td>{(currentPage - 1) * tasksPerPage + index + 1}</td>
                                                    <td>{task.title}</td>
                                                    <td>{task.description}</td>
                                                    <td>
                                                        <span className="badge" style={{
                                                            backgroundColor: getPriorityColor(task.priority)
                                                        }}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge" style={{
                                                            backgroundColor: getBadgeColor(task.status)
                                                        }}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td>{task.startDate?.slice(0, 10)}</td>
                                                    <td>{task.endDate?.slice(0, 10)}</td>

                                                    {/* Assign To */}
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            style={{ ...inputStyle, minWidth: '150px' }}
                                                            defaultValue=""
                                                            onChange={(e) => {
                                                                if (e.target.value) {
                                                                    handleAssign(task.id, e.target.value)
                                                                }
                                                            }}
                                                        >
                                                            <option value="">
                                                                {getAssignedUser(task.id)
                                                                    ? `✅ ${getAssignedUser(task.id)}`
                                                                    : 'Assign To'}
                                                            </option>
                                                            {users.map((user, i) => (
                                                                <option key={i} value={user.id}>
                                                                    {user.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>

                                                    {/* Change Priority */}
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            style={{ ...inputStyle, minWidth: '110px' }}
                                                            defaultValue={task.priority}
                                                            onChange={async (e) => {
                                                                try {
                                                                    await axiosInstance.put(`/tasks/updateTaskByAdmin/${task.id}`, {
                                                                        priority: e.target.value
                                                                    })
                                                                    alert('Priority updated!')
                                                                    fetchAllTasks()
                                                                } catch (err) {
                                                                    alert('Something went wrong')
                                                                }
                                                            }}
                                                        >
                                                            <option value="low">Low</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="high">High</option>
                                                        </select>
                                                    </td>

                                                    {/* Change Status */}
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            style={{ ...inputStyle, minWidth: '120px' }}
                                                            defaultValue={task.status}
                                                            onChange={async (e) => {
                                                                try {
                                                                    await axiosInstance.patch(`/tasks/updateTaskStatus/${task.id}`, {
                                                                        status: e.target.value
                                                                    })
                                                                    alert('Status updated!')
                                                                    fetchAllTasks()
                                                                } catch (err) {
                                                                    alert('Something went wrong')
                                                                }
                                                            }}
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

                                {/* Pagination */}
                                <div className="d-flex align-items-center justify-content-between mt-3">
                                    <p style={{ color: isDark ? '#aaa' : '#555', marginBottom: 0 }}>
                                        Showing {(currentPage - 1) * tasksPerPage + 1} to {Math.min(currentPage * tasksPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
                                    </p>
                                    <nav>
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    style={inputStyle}
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        style={currentPage === i + 1 ? {
                                                            backgroundColor: '#4e4edb',
                                                            borderColor: '#4e4edb',
                                                            color: '#fff'
                                                        } : inputStyle}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    style={inputStyle}
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer isDark={isDark} />
        </div>
    )
}

export default AllTasks