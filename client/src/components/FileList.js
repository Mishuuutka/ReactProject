import React, {useContext, useEffect} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const FileList = ({ files }) => {
    const {request} = useHttp()
    const {token} = useContext(AuthContext)

    async function download_file(fileName) {
        const data = await request('/api/upload/downloadFile', 'POST', {body: fileName}, {
            Authorization: `Bearer ${token}`}, false, true)
        const file = await data.blob()
        const fileUrl = window.URL.createObjectURL(file)
        const fileLink = document.createElement('a')
        fileLink.href = fileUrl
        fileLink.download = fileName
        document.body.appendChild(fileLink)
        fileLink.click()
        fileLink.remove()
    }

    function format_file(fileType) {
        switch (fileType) {
            case "png":
                return process.env.PUBLIC_URL + '/uploads/PngFormat.png'
            case "jpg":
                return process.env.PUBLIC_URL + '/uploads/JpgFormat.png'
            case "pdf":
                return process.env.PUBLIC_URL + '/uploads/PdfFormat.png'
            case "docx":
                return process.env.PUBLIC_URL + '/uploads/DocFormat.png'
            case "py":
                return process.env.PUBLIC_URL + '/uploads/PythonFormat.png'
            case "txt":
                return process.env.PUBLIC_URL + '/uploads/TxtFormat.png'
            case "js":
                return process.env.PUBLIC_URL + '/uploads/JsFormat.png'
            case "css":
                return process.env.PUBLIC_URL + '/uploads/CssFormat.png'
            case "html":
                return process.env.PUBLIC_URL + '/uploads/HtmlFormat.png'
            case "json":
                return process.env.PUBLIC_URL + '/uploads/JsonFormat.png'
            case "gitignore":
            case "md":
                return process.env.PUBLIC_URL + '/uploads/GitFormat.png'
            default:
                return process.env.PUBLIC_URL + '/uploads/DefaultFormat.png'
        }
    }

    function viewContextMenu(e, id) {
        e.preventDefault()
        const contextMenu = document.querySelector('.contextMenu_'+id)
        contextMenu.style.display = 'block'
    }

    async function removeFile(e, name, date){
        e.preventDefault()
        await request('/api/upload/removeFile', 'POST', {fileName: name, fileDate: date}, {
            Authorization: `Bearer ${token}`})
    }

    return (
        <div className="uploads">
            {files.map((file, index) => {
                return (
                    <div className="file_block" key={index}
                         onContextMenu={(e) => viewContextMenu(e, index)}
                         onMouseLeave={() => document.querySelector(`.contextMenu_${index}`).style.display = 'none'}>
                        <a
                        onClick={() => download_file(file.name)}>
                            <div className="file">
                                <img className="img_file" src={process.env.PUBLIC_URL + '/uploads/file.png'} alt="FILE"/>
                                <img className="format_file" src={format_file(file.type)} alt="FORMAT"/>
                            </div>
                        </a>
                        <p className="name_file">{file.name}</p>
                        <div className={'contextMenu contextMenu_'+index}>
                            <p onClick={(e) => removeFile(e, file.name, file.data)}>Удалить</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}