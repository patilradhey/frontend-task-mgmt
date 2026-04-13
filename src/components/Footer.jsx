import React from 'react'

const Footer = ({ isDark }) => {
    return (
        <footer
            className="text-center py-3"
            style={{
                backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa',
                borderTop: `1px solid ${isDark ? '#2e2e4f' : '#dee2e6'}`,
                color: isDark ? '#aaa' : '#555',
                fontSize: '14px'
            }}
        >
            © {new Date().getFullYear()} Task Management. All rights reserved.
        </footer>
    )
}

export default Footer