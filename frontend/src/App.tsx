import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary'
import AppRoutes from './Routes'

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App
