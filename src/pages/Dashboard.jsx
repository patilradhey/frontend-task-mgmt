import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import Navbar from '../components/Navbar'
import AsideBar from '../components/AsideBar'
import Footer from '../components/Footer'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

const Dashboard = ({ isDark, toggleTheme }) => {

    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTasks: 0,
        assignedTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inprogressTasks: 0,
        lowPriority: 0,
        mediumPriority: 0,
        highPriority: 0,
        myTasks: 0,
    })

    async function fetchUser() {
        try {
            const res = await axiosInstance.get('/user/getUserInfo')
            if (res.data.success) {
                setUser(res.data.user)
                if (res.data.user.role === 'admin') {
                    fetchAdminStats()
                } else {
                    fetchUserStats()
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function fetchAdminStats() {
        try {
            const usersRes = await axiosInstance.get('/user/getAllUsers')
            const tasksRes = await axiosInstance.get('/tasks/getAllTasks')
            const assignRes = await axiosInstance.get('/assignTask/allTasksWithUser')

            const tasks = tasksRes.data.tasks
            const completed = tasks.filter(t => t.status === 'completed').length
            const pending = tasks.filter(t => t.status === 'pending').length
            const inprogress = tasks.filter(t => t.status === 'inprogress').length
            const low = tasks.filter(t => t.priority === 'low').length
            const medium = tasks.filter(t => t.priority === 'medium').length
            const high = tasks.filter(t => t.priority === 'high').length

            setStats({
                totalUsers: usersRes.data.users.length,
                totalTasks: tasks.length,
                assignedTasks: assignRes.data.tasks.length,
                completedTasks: completed,
                pendingTasks: pending,
                inprogressTasks: inprogress,
                lowPriority: low,
                mediumPriority: medium,
                highPriority: high
            })
        } catch (err) {
            console.error(err)
        }
    }

    async function fetchUserStats() {
        try {
            const res = await axiosInstance.get('/assignTask/my_tasks')
            const tasks = res.data.tasks
            const completed = tasks.filter(t => t.Task?.status === 'completed').length
            const pending = tasks.filter(t => t.Task?.status === 'pending').length
            const inprogress = tasks.filter(t => t.Task?.status === 'inprogress').length

            setStats({
                myTasks: tasks.length,
                completedTasks: completed,
                pendingTasks: pending,
                inprogressTasks: inprogress
            })
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const cardStyle = {
        backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa',
        border: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
        borderRadius: '12px',
        padding: '25px',
        textAlign: 'center'
    }

    const chartCardStyle = {
        backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa',
        border: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
        borderRadius: '12px',
        padding: '25px'
    }

    // Bar Chart Data
    const barData = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [
            {
                label: 'Tasks by Status',
                data: [stats.pendingTasks, stats.inprogressTasks, stats.completedTasks],
                backgroundColor: ['#6c757d', '#ffc107', '#28a745'],
                borderRadius: 8
            }
        ]
    }

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: isDark ? '#fff' : '#000' }
            }
        },
        scales: {
            x: {
                ticks: { color: isDark ? '#fff' : '#000' },
                grid: { color: isDark ? '#2e2e4f' : '#dee2e6' }
            },
            y: {
                ticks: { color: isDark ? '#fff' : '#000' },
                grid: { color: isDark ? '#2e2e4f' : '#dee2e6' }
            }
        }
    }

    // Doughnut Chart Data
    const doughnutData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                label: 'Tasks by Priority',
                data: [stats.lowPriority, stats.mediumPriority, stats.highPriority],
                backgroundColor: ['#6c757d', '#ffc107', '#dc3545'],
                borderWidth: 0
            }
        ]
    }

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: isDark ? '#fff' : '#000' }
            }
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f0f1a' : '#ffffff' }}>
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

                        {/* Admin Dashboard */}
                        {user?.role === 'admin' && (
                            <>
                                <h3 className="mb-4">Admin Dashboard</h3>

                                {/* Stats Cards */}
                                <div className="row g-4 mb-5">
                                    <div className="col-md-4">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#4e4edb' }}>{stats.totalUsers}</h2>
                                            <p className="mb-0">Total Users</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#28a745' }}>{stats.totalTasks}</h2>
                                            <p className="mb-0">Total Tasks</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#ffc107' }}>{stats.assignedTasks}</h2>
                                            <p className="mb-0">Assigned Tasks</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#28a745' }}>{stats.completedTasks}</h2>
                                            <p className="mb-0">Completed Tasks</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#dc3545' }}>{stats.pendingTasks}</h2>
                                            <p className="mb-0">Pending Tasks</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#ffc107' }}>{stats.inprogressTasks}</h2>
                                            <p className="mb-0">In Progress Tasks</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts */}
                                <div className="row g-4">
                                    {/* Bar Chart */}
                                    <div className="col-md-7">
                                        <div style={chartCardStyle}>
                                            <h5 className="mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                                                Tasks by Status
                                            </h5>
                                            <Bar data={barData} options={barOptions} />
                                        </div>
                                    </div>

                                    {/* Doughnut Chart */}
                                    <div className="col-md-5">
                                        <div style={chartCardStyle}>
                                            <h5 className="mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                                                Tasks by Priority
                                            </h5>
                                            <Doughnut data={doughnutData} options={doughnutOptions} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* User Dashboard */}
                        {user?.role === 'user' && (
                            <>
                                <h3 className="mb-4">My Dashboard</h3>
                                <div className="row g-4">
                                    <div className="col-md-3">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#4e4edb' }}>{stats.myTasks}</h2>
                                            <p className="mb-0">Total Assigned</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#28a745' }}>{stats.completedTasks}</h2>
                                            <p className="mb-0">Completed</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#ffc107' }}>{stats.inprogressTasks}</h2>
                                            <p className="mb-0">In Progress</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div style={cardStyle}>
                                            <h2 style={{ color: '#dc3545' }}>{stats.pendingTasks}</h2>
                                            <p className="mb-0">Pending</p>
                                        </div>
                                    </div>
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

export default Dashboard