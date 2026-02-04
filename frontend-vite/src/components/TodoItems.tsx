import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri"

type taskProp = {
    title: string
}

export const TodoItems = (task: taskProp) => {
    return (
        <div className="flex items-center my-3 gap-2">
            <div className="flex flex-1 items-center">
                <input className="cursor-pointer" type="checkbox" name="" id="" />
                <p className="text-white ml-4 text-lg">{task.title}</p>
            </div>

            <div className="flex gap-2">
                <div className="border border-blue-600 p-2 rounded-full text-blue-600 cursor-pointer hover:bg-white">
                    <RiPencilLine />
                </div>
                <div className="border border-red-600 p-2 rounded-full text-red-600 cursor-pointer hover:bg-white">
                    <RiDeleteBinLine />
                </div>
            </div>

        </div>
    )
}