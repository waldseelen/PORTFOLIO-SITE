export default function Loading() {
    return (
        <div className="section flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Loading spinner */}
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-600" />
                </div>
                <p className="text-neutral-600 dark:text-neutral-400">Yükleniyor...</p>
            </div>
        </div>
    );
}
