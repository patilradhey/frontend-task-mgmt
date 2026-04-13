import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi'

const Navbar = ({ toggleTheme, isDark }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState()

    async function fetchUser() {
        const res = await axiosInstance.get('/user/getUserInfo')
        if (res.data.success) {
            setUser(res.data.user)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    function handleLogout() {
        localStorage.removeItem('b69')
        navigate('/')
    }

    return (
        <nav
            className="d-flex align-items-center justify-content-between px-4"
            style={{
                backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa',
                borderBottom: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
                height: '60px',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}
        >
            {/* Left - Title */}
            <h5
                className="mb-0"
                style={{ color: isDark ? '#fff' : '#000', fontWeight: '700' }}
            >
                📋 Task MGMT
            </h5>

            {/* Right - Welcome + Icons */}
            <div className="d-flex align-items-center gap-3">

                {/* Welcome */}
                <span style={{ color: isDark ? '#fff' : '#000', fontWeight: '500' }}>
                    Welcome, <b>{user?.name || 'User'}</b> 👋
                </span>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-sm"
                    style={{
                        backgroundColor: isDark ? '#2e2e4f' : '#e2e6ea',
                        color: isDark ? '#fff' : '#000',
                        border: 'none',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-danger"
                    style={{
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FiLogOut size={18} />
                </button>

            </div>
        </nav>
    )
}

export default Navbar