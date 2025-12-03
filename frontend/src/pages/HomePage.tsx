import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center">
                <Link to="/register">
                    <button className="py-6 px-16 text-2xl font-semibold text-white bg-blue-600 rounded-xl shadow-lg transition-all duration-200 transform hover:bg-blue-700 hover:shadow-xl hover:scale-105 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none active:bg-blue-800 active:scale-95">
                        Register Now
                    </button>
                </Link>
            </div>
        </div>
    )
}
