import type { Task } from "./types/Task";

// Propagate state changes based on dependency rules
export function propogateState(tasksData: Task[], task_id: number, task_state: Task["state"]) {
    if (task_state === "BACKLOG") { return }

    // Make a copy of original data
    const data_copy = [...tasksData]

    // Apply state change to first task
    const first_task = data_copy.find(task => task.id === task_id)
    if (first_task === undefined) { return }
    first_task.state = task_state

    // Apppy subsequent state changes using Depth First Search (DFS) Algorithm
    const queue: number[] = [task_id]
    const visited = new Set()

    while (queue.length > 0) {
        const id = queue.pop()
        visited.add(id)

        const task = data_copy.find(task => task.id === id)
        if (task === undefined) {continue}

        for (const dependant_id of task.dependents) {
            const dependant = data_copy.find(task => task.id === dependant_id)
            if (dependant === undefined) {continue}

            // Check if dependant is blocked
            const hasUnfinishedBlocker = dependant.blockers.some(
                dep_id => data_copy.find(task => task.id === dep_id)?.state !== "DONE"
            )
            const prevState = dependant.state

            if (hasUnfinishedBlocker) {
                dependant.state = "BACKLOG"
            } else if (dependant.state === "BACKLOG") {
                dependant.state = "TODO"
            }

            if (dependant.state !== prevState && !visited.has(dependant_id)) {
                queue.push(dependant_id)
            }
        }
    }

    return data_copy
}