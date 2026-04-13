import React, { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const res = await axiosInstance.post('/user/login', form)

            if (res.data.token) {
                localStorage.setItem('b69', res.data.token)
                alert(res.data.msg)
                navigate('/protected')
            } else {
                alert(res.data.msg)
                navigate('/')
            }
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.msg || "Something went wrong")
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
                    <p style={{ color: '#aaa', fontSize: '14px' }}>Login to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
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
                    <div className="mb-4">
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

                    {/* Login Button */}
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
                        Login
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-center mb-0" style={{ color: '#aaa', fontSize: '14px' }}>
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        style={{ color: '#4e4edb', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Register
                    </span>
                </p>

            </div>
        </div>
    )
}

export default Login