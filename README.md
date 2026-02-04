# Rooftop Energy — Take Home Test (Frontend)

A **To-do List App frontend** built using **React + Vite** that interfaces with a simple backend API to manage tasks with **dependency relationships**.

---

## Quick Start

### Prerequisites
- **Node.js** (16+ recommended)
- **npm** (or pnpm/yarn)
- **Docker & Docker Compose** (for running the backend)

### Run backend (Docker)
1. Open new commmand prompt and run `cd backend`
2. Ensure a `.env` exists (there is an example `.env` in the repo)
3. Start services:
  - Run `docker compose up -d`
  - Run `docker compose exec -it api uv run alembic upgrade head`
5. API will be available at http://localhost:8000

### Run frontend (dev)
1. Open new commmand prompt and run `cd frontend-vite`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open the URL shown by Vite (usually http://localhost:5173)

### Build / preview frontend:
- Build: `npm run build`
- Preview production build: `npm run preview`

### API endpoints used by the frontend (Can be found in /src/Api.tsx)
- Fetch all tasks `GET /tasks`
- Add new task `POST /tasks` Request body:  `{ title: string })`
- Delete task `DELETE /tasks/:id`
- Set task state `POST /tasks/:id/state/:state`
- Add task dependency `POST /dependencies/:task_id/blockers/:blocker_id`


## Task Dependency & Propagation Approach

### Task Model (Can be found in `/src/components/types/Task.tsx`)
- `id: number`
- `title: string`
- `state: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE"`
- `blockers: number[]`
  - Array of task IDs this task depends on. If any of the tasks in this array is not "DONE", this task will be set to "BACKLOG"
- `dependents: number[]`
  - Array of task IDs that depend on this task. If this task is not "DONE", the tasks in this array should be in "BACKLOG" state

### Propagation logic (Can be found in `/src/utils.tsx`)
- When a task’s state is changed to a non-`BACKLOG` state, `propogateState(tasks, id, newState)`:
  - Makes a copy of tasks
  - Applies the state change to the target task
  - Traverses dependents (Depth-First Search):
    - If any blocker of a dependent is not `DONE` → set dependent to `BACKLOG`
    - Else, if dependent's state was `BACKLOG` → set it to `TODO`
  - Uses a visited `Set()` to avoid re-processing nodes in the traversal
- This keeps downstream tasks blocked automatically when upstream tasks are unfinished.


## Data Structures & Algorithms

- Data structure: array of Task objects (simple, flat list).
- Traversal algorithm: Depth-First Search over the dependency array.


## Assumptions & Trade-Offs

- **Small dataset assumption**: arrays + `.find()` is simpler and adequate for the take-home scope.
- **Simplicity over optimality**: readable, easy-to-follow code chosen over micro-optimized structures.
- **No explicit cycle handling**: assumes input graph is acyclic (no circular dependencies). Cycles may cause repeated state toggles or improper propagation.
- **UI optimistic updates**: current code updates UI only after successful API responses (safer but slower UX), except for local propagation logic which is applied after state-change responses.


## Potential improvements

### Performance
- Normalize tasks into a `Map<id, Task>` for O(1) lookup and O(N + E) propagation.
- Avoid repeated `.find()` calls inside loops.
- Add memoization/React optimizations: `useCallback` for handlers and `useMemo` for columns (avoids frequent table re-inits).
- Virtualize rows for very large task lists.

### Robustness
- Add cycle detection and validation when adding dependencies.
- End-to-end and unit tests for propagation logic & API interactions.

### UX & safety
- Show blocked reason/tooltips on tasks.
- Better error messages and loading states.
