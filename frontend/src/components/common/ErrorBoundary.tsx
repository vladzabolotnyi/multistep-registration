import React, { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
    resetKeys?: any[]
}

interface State {
    hasError: boolean
    error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
        }
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.resetKeys !== this.props.resetKeys) {
            this.setState({
                hasError: false,
                error: null,
            })
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="error-boundary">
                    <DefaultErrorFallback error={this.state.error} />
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

const DefaultErrorFallback: React.FC = () => (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen text-center">
        <div className="p-6 max-w-md bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-red-500">
                <svg
                    className="mx-auto w-16 h-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                </svg>
            </div>

            <h2 className="mb-2 text-xl font-bold text-gray-800">Something went wrong</h2>
            <p className="mb-4 text-gray-600">
                We apologize for the inconvenience. Please try again.
            </p>

            <div className="flex gap-3">
                <button
                    onClick={() => window.location.reload()}
                    className="flex-1 py-2 px-4 font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                >
                    Reload Page
                </button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
                If the problem persists, please contact support.
            </p>
        </div>
    </div>
)
