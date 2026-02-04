// import { TodoItems } from "./TodoItems"
import { getColumns } from "./TodoListColumns"
import { TodoTable } from "./TodoTable"
import { useEffect, useState, } from "react"
import { addBlocker, addNewTask, deleteTask, getAllTasks, setState } from "@/Api"
import type { Task } from "@/types/Task"
import { propogateState } from "@/utils"

export const Todo = () => {
    const [tasksData, setTasksData] = useState<Task[]>([])
    const [newTaskTitle, setNewTaskTitle] = useState<string>("")

    useEffect(() => {
        getTasks()
    }, [])

    const getTasks = async () => {
        try {
            const api_data = await getAllTasks()

            setTasksData(api_data)

            console.log("Fetched Data Successfully!")
        } catch (error) {
            console.error("Failed to fetch data", error)
        }
    }

    const addTask = async () => {
        try {
            if (newTaskTitle === "") {
                console.log("No Input")
                return
            }

            const new_task = await addNewTask(newTaskTitle)
            if (new_task) {
                setTasksData([
                    ...tasksData,
                    new_task
                ])
                console.log("Added New Task Successfully!")
            }
            setNewTaskTitle("")
        } catch (error) {
            console.log("Failed to add task:", error)
        }
    }

    const removeTask = async (task_id: number) => {
        try {
            const isRemoved = await deleteTask(task_id)

            if (isRemoved) {
                setTasksData(prev => prev.filter(task => task.id !== task_id))
                console.log("Removed Task Successfully!")
            } else {
                throw new Error('Error removing task')
            }
        } catch (error) {
            console.log("Failed to remove task: ", error)
        }
    }

    const editStatus = async (task_id: number, task_status: Task["state"]) => {
        try {
            if (task_status === "BACKLOG") return

            const response = await setState(task_id, task_status)

            if (response.state === task_status) {
                setTasksData(prev => {
                    const updated_task_data = propogateState(tasksData, task_id, task_status)
                    return updated_task_data ?? prev
                })
                console.log("Edited Task Status Successfully!")
            }
        } catch (error) {
            console.log("Failed to edit status: ", error)
        }
    }

    const addDependency = async (task_id: number, dependency_id: number | null) => {
        try {
            if (task_id === dependency_id || dependency_id === null) return

            const isAdded = await addBlocker(task_id, dependency_id)

            if(isAdded) {
                const dependency_task = tasksData.find(task => task.id === dependency_id)
                setTasksData(prev => prev.map(task => {
                    if (task.id === task_id) {
                        return { 
                            ...task,
                            state: dependency_task?.state !== "DONE" ? "BACKLOG" : task.state,
                            blockers: task.blockers.concat([dependency_id]) 
                        }
                    }
                    else if (task.id === dependency_id) {
                        return { ...task, dependents: task.dependents.concat([task_id]) }
                    } else {
                        return task
                    }
                }))
                console.log("Added Task Dependency Successfully!")
            }
        } catch (error) {
            console.log("Failed to add dependency: ", error)
        }
    }

    return (
        <div className="bg-[#222634] place-self-center w-11/12 max-w-7xl flex flex-col p-7 min-h-137.5 rounded-xl border border-[#3a3f4e]">
            
            {/* TO-DO LIST TITLE */}
            <div className="flex items-center mt-7">
                <h1 className="text-3xl text-white font-semibold">To-do List</h1>
            </div>

            {/* ADD NEW TASK */}
            <div className="flex items-center my-7 bg-[#141624] rounded-full">
                <input 
                    className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 text-white" 
                    type="text" 
                    placeholder="Add new task..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <button 
                    className="border-none rounded-full bg-[#FCD913] w-32 h-14 text-lg font-medium cursor-pointer hover:bg-[#c7ab0f]"
                    onClick={() => addTask()}
                >
                    ADD
                </button>
            </div>

            {/* TO-DO LIST TABLE */}
            <div className="w-full mx-auto">
                <TodoTable columns={getColumns(removeTask, editStatus, addDependency, tasksData)} data={tasksData} />
            </div>

        </div>
    )
}
