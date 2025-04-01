import { isAxiosError } from "axios"
import api from "../lib/axios"
import { ProjectFormData } from "../types"

export async function createProject(formData: ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData)
        console.log('_____>', data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}