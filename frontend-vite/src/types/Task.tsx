// After testing the backend API, its found that dependant tasks automatically
// change state to "BACKLOG" when the task it depends on is not "DONE" even though
// there is a "BLOCKED" state (???).
// Tasks that are automatically changed state to "BACKLOG" cannot change state
// until the task they depend on is set to "DONE"
export type Task = {
    id: number
    title: string
    state: "TODO" | "IN_PROGRESS" | "DONE" | "BACKLOG"
    blockers: number[]
    dependents: number[]
}

// In the frontend, tasks that are set as "BACKLOG" are displayed as "BLOCKED"
export const TaskStatus: { value: Task["state"]; label: string }[] = [
    { value: "TODO", label: "Todo" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
    { value: "BACKLOG", label: "Blocked" },
]
