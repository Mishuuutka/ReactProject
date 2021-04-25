import React, {useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";


export const FileList = ({ files }) => {
    const {request} = useHttp()
    const {token} = useContext(AuthContext)

    async function download_file(e) {
        const data = await request('/api/upload/openfile', 'POST', {body: e}, {
            Authorization: `Bearer ${token}`}, false, true)
        const file = await data.blob()
        const dowlUrl = window.URL.createObjectURL(file)
        const link_file = document.createElement('a')
        link_file.href = dowlUrl
        link_file.download = e
        document.body.appendChild(link_file)
        link_file.click()
        link_file.remove()

    }

    return (
        <div className="files">
            {files.map(file => {
                return (
                    <a className="file_block"
                    onClick={e => download_file(file.name)}>{file.name}</a>
                )
            })}
        </div>
    )

}