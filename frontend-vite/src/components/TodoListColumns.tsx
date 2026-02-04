"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState } from "react"
import { TaskStatus } from "@/types/Task"

import type { Task } from "@/types/Task"

export const getColumns = (
    onDelete: (task_id: number) => Promise<void> | void,
    onStatusEdit: (task_id: number, task_status: Task["state"]) => Promise<void> | void,
    onAddDependency: (task_id: number, dependency_id: number | null) => Promise<void> | void,
    tasksData: Task[]
): ColumnDef<Task>[] => [
    {
        accessorKey: "id",
        header: "ID",
        size: 30,
    },
    {
        accessorKey: "title",
        header: "TITLE",
    },
    {
        accessorKey: "blockers",
        header: "DEPENDENCIES",
        cell: ({ row }) => {
            const task = row.original

            if (task.blockers.length <= 0) {
                return "None"
            } else {
                return task.blockers.join(", ")
            }
        }
    },
    {
        accessorKey: "state",
        header: "STATUS",
        size: 50,
        cell: ({ row }) => {
            const task = row.original

            return (
                <Badge>
                    {TaskStatus.find((status) => status.value === task.state)?.label}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        header: "ACTIONS",
        size: 30,
        cell: ({ row }) => {
            const task = row.original

            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
            const [isStatusEditDialogOpen, setIsStatusEditDialogOpen] = useState<boolean>(false)
            const [isAddDependencyDialogOpen, setIsAddDependencyDialogOpen] = useState<boolean>(false)
            const [defaultState, setDefaultState] = useState<Task["state"]>(task.state)
            const [dependencyId, setDependencyId] = useState<string>("")

            return (
                <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#222634] border border-[#3a3f4e] text-white" align="end">
                        
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setIsStatusEditDialogOpen(true)}
                            disabled={ task.state === "BACKLOG" }
                        >Edit Status</DropdownMenuItem>

                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setIsAddDependencyDialogOpen(true)}
                        >Add Dependency</DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="border border-[#3a3f4e]" />
                        
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            variant="destructive"
                        >Delete</DropdownMenuItem>
                        
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* DELETE DIALOG */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent className="bg-[#222634] border-[#3a3f4e]" size="sm">
                        <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle className="text-white">Delete task?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this task. Are you Sure?
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent text-white cursor-pointer" variant="outline">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            className="cursor-pointer"
                            onClick={async () => {
                                await onDelete(task.id)
                                setIsDeleteDialogOpen(false)
                            }} 
                            variant="destructive"
                        >Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* STATUS EDIT DIALOG */}
                <Dialog open={isStatusEditDialogOpen} onOpenChange={setIsStatusEditDialogOpen}>
                    <DialogContent className="sm:max-w-sm bg-[#222634] border-[#3a3f4e]">
                        <DialogHeader>
                            <DialogTitle className="text-white">Edit Status</DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                            <Select value={defaultState} onValueChange={(value: Task["state"]) => setDefaultState(value)}>
                                <SelectTrigger className="w-full text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#222634] text-white border-[#3a3f4e]">
                                    {TaskStatus.map((status) => {
                                        if (status.value !== "BACKLOG") {
                                            return <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                        }
                                    })}
                                </SelectContent>
                            </Select>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="cursor-pointer" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={() => onStatusEdit(task.id, defaultState)} className="cursor-pointer">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ADD DEPENDENCY DIALOG */}
                <Dialog open={isAddDependencyDialogOpen} onOpenChange={setIsAddDependencyDialogOpen}>
                    <DialogContent className="sm:max-w-sm bg-[#222634] border-[#3a3f4e]">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add Dependency</DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                            <Select value={dependencyId} onValueChange={(value: string) => setDependencyId(value)}>
                                <SelectTrigger className="w-full text-white">
                                    <SelectValue placeholder="Add dependency..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#222634] text-white border-[#3a3f4e]">
                                    {tasksData.map((data) => {
                                        if (data.id !== task.id && !task.blockers.includes(data.id)) {
                                            return <SelectItem key={data.id} value={data.id.toString()}>{data.title} (ID: {data.id})</SelectItem>
                                        }
                                    })}
                                </SelectContent>
                            </Select>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="cursor-pointer" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={() => onAddDependency(task.id, parseInt(dependencyId))} className="cursor-pointer">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                </>
            )
        },
    },
]