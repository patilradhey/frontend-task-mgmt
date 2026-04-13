import React, { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        contactNumber: ''
    })

    const [file, setFile] = useState(null)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData()
        Object.keys(form).forEach(key => {
            formData.append(key, form[key])
        })
        formData.append('myFile', file)

        const res = await axiosInstance.post('/user/register', formData)
        if (res.data.success) {
            alert(res.data.msg)
            navigate('/')
        } else {
            alert("Registration failed")
            navigate('/register')
        }
    }

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: '#0f0f1a' }}
        >
            <div
                className="p-4 rounded-4 shadow-lg"
                style={{
                    backgroundColor: '#1a1a2e',
                    width: '100%',
                    maxWidth: '420px',
                    border: '1px solid #2e2e4f'
                }}
            >
                {/* Logo / Title */}
                <div className="text-center mb-4">
                    <h2 style={{ color: '#fff', fontWeight: '700' }}>📋 Task MGMT</h2>
                    <p style={{ color: '#aaa', fontSize: '14px' }}>Create your account</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="mb-3">
                        <label className="form-label text-white">Name</label>
                        <input
                            name="name"
                            type="text"
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="form-control"
                            style={{
                                backgroundColor: '#0f0f1a',
                                border: '1px solid #2e2e4f',
                                color: '#fff'
                            }}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label text-white">Email</label>
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="form-control"
                            style={{
                                backgroundColor: '#0f0f1a',
                                border: '1px solid #2e2e4f',
                                color: '#fff'
                            }}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label text-white">Password</label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="form-control"
                            style={{
                                backgroundColor: '#0f0f1a',
                                border: '1px solid #2e2e4f',
                                color: '#fff'
                            }}
                            required
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="mb-3">
                        <label className="form-label text-white">Contact Number</label>
                        <input
                            name="contactNumber"
                            type="text"
                            onChange={handleChange}
                            placeholder="Enter your contact number"
                            className="form-control"
                            style={{
                                backgroundColor: '#0f0f1a',
                                border: '1px solid #2e2e4f',
                                color: '#fff'
                            }}
                            required
                        />
                    </div>

                    {/* Profile Image */}
                    <div className="mb-4">
                        <label className="form-label text-white">Profile Image</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="form-control"
                            style={{
                                backgroundColor: '#0f0f1a',
                                border: '1px solid #2e2e4f',
                                color: '#fff'
                            }}
                            accept="image/*"
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="btn w-100 mb-3"
                        style={{
                            backgroundColor: '#4e4edb',
                            color: '#fff',
                            fontWeight: '600',
                            borderRadius: '8px'
                        }}
                    >
                        Register
                    </button>

                </form>

                {/* Login Link */}
                <p className="text-center mb-0" style={{ color: '#aaa', fontSize: '14px' }}>
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/')}
                        style={{ color: '#4e4edb', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    )
}

export default Register