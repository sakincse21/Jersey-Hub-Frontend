import { Loader2Icon } from "lucide-react"

const LoadingScreen = () => {
    return <div className="w-full h-full flex justify-center items-center flex-1">
        <div><Loader2Icon size={60} className="animate-spin" /></div>
    </div>
}

export default LoadingScreen