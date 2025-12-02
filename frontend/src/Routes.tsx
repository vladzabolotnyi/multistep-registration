import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router'

const RegistrationPage = React.lazy(() => import('./pages/RegistrationPage'))
const HomePage = React.lazy(() => import('./pages/HomePage'))

function AppRoutes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/" element={<HomePage />}></Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
