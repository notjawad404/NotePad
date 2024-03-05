import { Tasks } from "./Data"
import {useSelector} from "react-redux"

export default function Home() {
    const tasks = useSelector(state => state.tasks);
    console.log(tasks)
    return (
    <div className=" bg-slate-900 text-white h-screen">
        <div className="text-center">
            <h1>Task Master</h1>
        </div>
        <div className=" bg-white w-3/4 mx-auto shadow-lg text-black h-3/4 overflow-y-auto">
            <div className="py-2">
               {Tasks.map((task, index) => (
                
                    <div key={index} className="text-white px-2 py-2 bg-slate-700 my-1 mx-2 rounded-2xl">
                        <div className="flex justify-between items-center">
                        <h1 className="text-xl font-medium">{task.title}</h1>
                        <h1>{task.Date}</h1>
                    </div>
                    <div className="flex justify-center items-center">
                        <button className=" bg-green-600 p-2 mx-1 rounded-xl">Edit</button>
                        <button className="bg-red-600 p-2 mx-1 rounded-xl">Delete</button>
                    </div>

                    </div>

              
               ))}
            </div>
        </div>
    </div>
  )
}
