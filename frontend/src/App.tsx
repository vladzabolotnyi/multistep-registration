import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string>("");

  const fetchData = () => {
    fetch(`http://localhost:${import.meta.env.VITE_PORT}/`)
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="py-12 px-4 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto space-y-8 max-w-md">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Welcome to Vite + React
          </h1>
          <p className="text-gray-600">
            Get started by editing{" "}
            <code className="p-1 text-sm bg-gray-100 rounded">src/App.tsx</code>
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="space-y-4 text-center">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="py-2 px-4 font-semibold text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-600"
            >
              Count is {count}
            </button>

            <button
              onClick={fetchData}
              className="block py-2 px-4 w-full font-semibold text-white bg-green-500 rounded-md transition-colors hover:bg-green-600"
            >
              Fetch from Server
            </button>

            {message && (
              <div className="p-4 mt-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">Server Response:</p>
                <p className="font-medium text-gray-900">{message}</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-center text-gray-500">
          Built with Vite, React, and Tailwind CSS
        </div>
      </div>
    </div>
  );
}

export default App;

