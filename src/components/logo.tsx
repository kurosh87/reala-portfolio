import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <span className={cn('text-foreground inline-flex h-6 w-fit items-center gap-2', className)}>
            <svg className="text-foreground h-5 w-7" viewBox="0 0 349 259" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M348.543 94V153.5C348.543 172 333.043 178 322.043 178H268.543C260.044 178 265.544 186 267.544 189C269.74 192.295 303.71 235.833 321.043 258.5H204.043C187.876 238 204.039 258.502 146.045 185.5C135.885 172.71 154.126 166.5 157.544 165C180.711 154.833 234.789 131.294 241.544 128C260 119 259 112.5 259 94H348.543ZM152 0C190.8 0 239.833 0.333333 259 0.5V94H207C173 94 157.881 90.377 141.5 126.5C102.5 212.5 109.333 197.167 102.5 212.5H0C15 179.167 -3 217.5 65 69C83.5376 28.5172 103.5 0 152 0Z" fill="currentColor" />
            </svg>
            <span className="text-lg font-semibold leading-none tracking-tight">Reala</span>
        </span>
    )
}

export const LogoIcon = ({ className }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg className={cn('text-foreground h-5 w-7', className)} viewBox="0 0 349 259" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M348.543 94V153.5C348.543 172 333.043 178 322.043 178H268.543C260.044 178 265.544 186 267.544 189C269.74 192.295 303.71 235.833 321.043 258.5H204.043C187.876 238 204.039 258.502 146.045 185.5C135.885 172.71 154.126 166.5 157.544 165C180.711 154.833 234.789 131.294 241.544 128C260 119 259 112.5 259 94H348.543ZM152 0C190.8 0 239.833 0.333333 259 0.5V94H207C173 94 157.881 90.377 141.5 126.5C102.5 212.5 109.333 197.167 102.5 212.5H0C15 179.167 -3 217.5 65 69C83.5376 28.5172 103.5 0 152 0Z" fill="currentColor" />
        </svg>
    )
}
