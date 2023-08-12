export default function Home() {
    const roomId = crypto.randomUUID();

    return (
        <main className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 dark:bg-neutral-900">
            <h1 className="text-6xl font-bold text-center text-neutral-900 dark:text-gray-100">
                RPS Game
            </h1>

            <div className="flex flex-col items-center justify-center w-full h-full">
                <a
                    className="px-4 py-2 mt-4 text-lg font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    href={`/rooms/${roomId}`}
                >
                    Create Room
                </a>
            </div>
        </main>
    );
}
