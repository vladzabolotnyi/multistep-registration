import MultiStepForm from './components/layout/MultistepForm'
import { FormProvider } from './contexts/FormContext'

function App() {
    return (
        <FormProvider>
            <div className="min-h-screen from-gray-50 to-gray-100 bg-linear-to-br">
                <div className="container py-8 px-4 mx-auto max-w-4xl">
                    <header className="mb-10 text-center">
                        <h1 className="mb-3 text-4xl font-bold text-gray-900">
                            User Registration
                        </h1>
                        <p className="text-lg text-gray-600">
                            Complete your registration in a few simple steps
                        </p>
                    </header>

                    <main className="p-6 bg-white rounded-2xl shadow-xl md:p-8">
                        <MultiStepForm />
                    </main>

                    <footer className="mt-8 text-sm text-center text-gray-500">
                        <p>React + Go Multi-step Registration Form</p>
                        <p className="mt-1">
                            All your data is securely stored locally during registration
                        </p>
                    </footer>
                </div>
            </div>
        </FormProvider>
    )
}

export default App
