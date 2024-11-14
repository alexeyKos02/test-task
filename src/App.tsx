import './App.css'
import ToDoView from "./views/ToDoView.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            <ToDoView/>
            <ToastContainer/>
        </>
    )
}

export default App
