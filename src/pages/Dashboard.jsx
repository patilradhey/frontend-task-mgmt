import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import Navbar from '../components/Navbar'
import AsideBar from '../components/AsideBar'
import Footer from '../components/Footer'

const Dashboard = ({ isDark, toggleTheme }) => {

    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTasks: 0,
        assignedTasks: 0,
        myTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
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

            setStats({
                totalUsers: usersRes.data.users.length,
                totalTasks: tasks.length,
                assignedTasks: assignRes.data.tasks.length,
                completedTasks: completed,
                pendingTasks: pending
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

                        {/* Admin Dashboard */}
                        {user?.role === 'admin' && (
                            <>
                                <h3 className="mb-4">Admin Dashboard</h3>
                                <div className="row g-4">
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