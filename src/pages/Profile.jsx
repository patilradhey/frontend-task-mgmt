import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import Navbar from '../components/Navbar'
import AsideBar from '../components/AsideBar'
import Footer from '../components/Footer'
import { FiEdit2 } from 'react-icons/fi'

const Profile = ({ isDark, toggleTheme }) => {

    const [user, setUser] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState({
        name: '',
        contactNumber: '',
        password: ''
    })

    async function fetchUser() {
        try {
            const res = await axiosInstance.get('/user/getUserInfo')
            if (res.data.success) {
                setUser(res.data.user)
                setForm({
                    name: res.data.user.name || '',
                    contactNumber: res.data.user.contactNumber || '',
                    password: ''
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('name', form.name)
            formData.append('contactNumber', form.contactNumber)
            if (form.password) formData.append('password', form.password)

            const res = await axiosInstance.patch(`/user/updateUser/${user.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (res.data.success) {
                alert(res.data.msg)
                setEditMode(false)
                fetchUser()
            }
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.msg || 'Something went wrong')
        }
    }

    const inputStyle = {
        backgroundColor: isDark ? '#0f0f1a' : '#fff',
        border: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
        color: isDark ? '#fff' : '#000'
    }

    const cardStyle = {
        backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa',
        border: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
        borderRadius: '16px',
        padding: '30px'
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
                        <h3 className="mb-4">My Profile</h3>

                        <div style={{ maxWidth: '600px' }}>
                            <div style={cardStyle}>

                                {/* Profile Image */}
                                <div className="text-center mb-4">
                                    <img
                                        src={user?.img_path || 'https://via.placeholder.com/120'}
                                        alt="profile"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '3px solid #4e4edb'
                                        }}
                                    />
                                </div>

                                {/* View Mode */}
                                {!editMode ? (
                                    <>
                                        <div className="mb-3">
                                            <label style={{ color: isDark ? '#aaa' : '#555', fontSize: '13px' }}>Name</label>
                                            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.name}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label style={{ color: isDark ? '#aaa' : '#555', fontSize: '13px' }}>Email</label>
                                            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.email}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label style={{ color: isDark ? '#aaa' : '#555', fontSize: '13px' }}>Contact Number</label>
                                            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.contactNumber || 'Not provided'}</p>
                                        </div>
                                        <div className="mb-4">
                                            <label style={{ color: isDark ? '#aaa' : '#555', fontSize: '13px' }}>Role</label>
                                            <p>
                                                <span className="badge" style={{
                                                    backgroundColor: user?.role === 'admin' ? '#dc3545' : '#4e4edb',
                                                    fontSize: '13px'
                                                }}>
                                                    {user?.role}
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            className="btn w-100"
                                            style={{ backgroundColor: '#4e4edb', color: '#fff', borderRadius: '8px' }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            <FiEdit2 size={16} /> Edit Profile
                                        </button>
                                    </>
                                ) : (
                                    /* Edit Mode */
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Contact Number</label>
                                            <input
                                                name="contactNumber"
                                                type="text"
                                                value={form.contactNumber}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">
                                                New Password{' '}
                                                <span style={{ color: '#aaa', fontSize: '12px' }}>
                                                    (leave empty to keep current)
                                                </span>
                                            </label>
                                            <input
                                                name="password"
                                                type="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Enter new password"
                                                className="form-control"
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn w-100"
                                                style={{ backgroundColor: '#4e4edb', color: '#fff', borderRadius: '8px' }}
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-100"
                                                style={{ backgroundColor: '#dc3545', color: '#fff', borderRadius: '8px' }}
                                                onClick={() => setEditMode(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer isDark={isDark} />
        </div>
    )
}

export default Profile