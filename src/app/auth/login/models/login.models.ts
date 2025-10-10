export interface User {
    id: string
    document: number
    email: string
    name: string
    password: string
}

export interface ErrorAuth {
    message: string
}