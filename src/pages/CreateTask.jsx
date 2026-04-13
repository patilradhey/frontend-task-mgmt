import React, { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AsideBar from '../components/AsideBar'
import Footer from '../components/Footer'

const CreateTask = ({ isDark, toggleTheme }) => {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'low',
        status: 'pending',
        startDate: '',
        endDate: ''
    })

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await axiosInstance.post('/tasks/create', form)
            if (res.data.success) {
                alert(res.data.msg)
                navigate('/protected')
            } else {
                alert('Something went wrong')
            }
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.msg || 'Something went wrong')
        }
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
                        <h3 className="mb-4">Create Task</h3>

                        <div className="p-4 rounded-4" style={{
                            backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa',
                            border: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
                            maxWidth: '600px'
                        }}>
                            <form onSubmit={handleSubmit}>

                                {/* Title */}
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        name="title"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="Enter task title"
                                        className="form-control"
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        onChange={handleChange}
                                        placeholder="Enter task description"
                                        className="form-control"
                                        rows={3}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Priority */}
                                <div className="mb-3">
                                    <label className="form-label">Priority</label>
                                    <select
                                        name="priority"
                                        onChange={handleChange}
                                        className="form-select"
                                        style={inputStyle}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        name="status"
                                        onChange={handleChange}
                                        className="form-select"
                                        style={inputStyle}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="mb-3">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        name="startDate"
                                        type="date"
                                        onChange={handleChange}
                                        className="form-control"
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div className="mb-4">
                                    <label className="form-label">End Date</label>
                                    <input
                                        name="endDate"
                                        type="date"
                                        onChange={handleChange}
                                        className="form-control"
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100"
                                    style={{
                                        backgroundColor: '#4e4edb',
                                        color: '#fff',
                                        fontWeight: '600',
                                        borderRadius: '8px'
                                    }}
                                >
                                    Create Task
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer isDark={isDark} />
        </div>
    )
}

export default CreateTask