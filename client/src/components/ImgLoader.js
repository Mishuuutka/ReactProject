import React, {useState, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const ImgLoader = () => {
    const [drag, setDrag] = useState(false)
    const {request} = useHttp()
    const auth = useContext(AuthContext)

    function dragStartHandler (e) {
        e.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler (e) {
        e.preventDefault()
        setDrag(false)
    }

    async function onDropHandler (e) {
        try {
            e.preventDefault()
            let files = [...e.dataTransfer.files]
            const formData = new FormData()
            formData.append('files', files[0])
            const data = await request('/api/upload/file', 'POST', formData, {
                Authorization: `Bearer ${auth.token}`}, true)
        }catch (e) {}
        setDrag(false)
    }

    if (drag) {
        return (
            <div className="on_loader"
                onDragStart={e => dragStartHandler(e)}
                onDragLeave={e => dragLeaveHandler(e)}
                onDragOver={e => dragStartHandler(e)}
            onDrop={e => onDropHandler(e)}>
                <h3>Что-то есть</h3>
            </div>
        )
    }

    return (
        <div className="off_loader"
             onDragStart={e => dragStartHandler(e)}
             onDragLeave={e => dragLeaveHandler(e)}
             onDragOver={e => dragStartHandler(e)}>
            <h3>Ничего нет</h3>
        </div>
    )
}