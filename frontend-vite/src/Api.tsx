import axios from "axios"
import { TaskStatus } from "./types/Task"
import type { Task } from "./types/Task"

const base_url = " http://localhost:8000"
const axiosRequest = axios.create({ baseURL: base_url })

export const getAllTasks = async () => {
    try {
        const response = await axiosRequest.get('/tasks')
        console.log("Response: ", response)
        return response.data
    } catch (error) {
        console.error("Failed to fetch tasks data: ", error)
    }
}

export const addNewTask = async (title: string) => {
    try {
        const response = await axiosRequest.post('/tasks', {title: title})
        console.log("Response: ", response)
        return response.data
    } catch (error) {
        console.error("Failed to add new task: ", error)
    }
}

 export const deleteTask = async (task_id: number) => {
    try {
        const response = await axiosRequest.delete(`/tasks/${task_id}`)
        console.log("Response: ", response)
        return response.status === 204
    } catch (error) {
        console.error("Failed to delete task: ", error)
    }
 }

 export const setState = async (task_id: number, task_state: Exclude<Task["state"], "BACKLOG">) => {
    try {
        const valid_statuses: Exclude<Task["state"], "BACKLOG">[] = TaskStatus
        .filter(status => status.value !== "BACKLOG")
        .map(status => status.value as Exclude<Task["state"], "BACKLOG">)

        if (!valid_statuses.includes(task_state)) {
            throw new Error('Invalid state')
        }

        const response = await axiosRequest.post(`/tasks/${task_id}/state/${task_state}`)
        console.log("Response: ", response)
        return response.data
    } catch (error) {
        console.error("Failed to update task state: ", error)
    }
 }

 export const addBlocker = async (task_id: number, blocker_id: number) => {
    try {
        const response = await axiosRequest.post(`/dependencies/${task_id}/blockers/${blocker_id}`)
        console.log("Response: ", response)
        return response.status === 200
    } catch (error) {
        console.error("Failed to add blocker: ", error)
    }
 }
