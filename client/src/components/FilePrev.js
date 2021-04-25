import React, {useContext, useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {Loader} from "./Loader";
import {FileList} from "./FileList";
import {AuthContext} from "../context/AuthContext";


export const FilePrev = () => {
    const [file, setFile] = useState([])
    const {loading, request} = useHttp()
    const {token} = useContext(AuthContext)

    const fetchFiles = useCallback(async () => {
        try {
            const data = await request('/api/upload/getfile', 'GET', null, {
                Authorization: `Bearer ${token}`})
            setFile(data)
            console.log(data)
        }catch (e) {}
    }, [token, request])

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            { !loading && <FileList files={file}/>}
        </div>
    )
}