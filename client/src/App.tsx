import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Earnify</h1>
            <p className="text-secondary text-lg">Earn crypto by completing tasks!</p>

            <div className="card bg-white p-6 rounded-lg shadow-lg">
                <button
                    onClick={() => setCount((count) => count + 1)}
                    className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
                >
                    Count is {count}
                </button>
            </div>
        </div>
    )
}

export default App
