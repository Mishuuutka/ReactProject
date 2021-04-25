import React from 'react'
import {ImgLoader} from "../components/ImgLoader";
import {FilePrev} from '../components/FilePrev'

export const LoaderPage = () => {
    return (
        <div>
            <h1>Загрузить фотографию</h1>
            <ImgLoader />
            <FilePrev />
        </div>
    )
}