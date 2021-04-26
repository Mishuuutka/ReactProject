import React, {useState, useContext, useCallback, useEffect} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {FileList} from "../components/FileList";

export const LoaderPage = () => {
    const [drag, setDrag] = useState(false)
    const [file, setFile] = useState([])
    const auth = useContext(AuthContext)
    const {loading, request} = useHttp()
    const {token} = useContext(AuthContext)

    const fetchFiles = useCallback(async () => {
        try {
            const data = await request('/api/upload/getFileInfo', 'GET', null, {
                Authorization: `Bearer ${token}`})

            setFile(data)
        }catch (e) {}
    }, [token, request])

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
        fetchFiles()
    }

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    function dragStartHandler (e) {
        e.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler (e) {
        e.preventDefault()
        setDrag(false)
    }

    if (loading) {
        return <Loader />
    }

    if (file.length === 0) {
        return (
            <div className="zero_files"
                 onDragStart={e => dragStartHandler(e)}
                 onDragLeave={e => dragLeaveHandler(e)}
                 onDragOver={e => dragStartHandler(e)}
                 onDrop={e => onDropHandler(e)}>
                <h3>Добавьте свой первый файл!</h3>
            </div>
        )
    }

    if (drag) {
        return (
            <div className="on_loader"
                 onDragStart={e => dragStartHandler(e)}
                 onDragLeave={e => dragLeaveHandler(e)}
                 onDragOver={e => dragStartHandler(e)}
                 onDrop={e => onDropHandler(e)}>
            </div>
        )
    }

    return (
        <div
            onDragStart={e => dragStartHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragStartHandler(e)}
            onDrop={e => onDropHandler(e)}>
            <div>
                { !loading && file.length !== 0 && <FileList files={file}/>}
            </div>
        </div>
    )
}