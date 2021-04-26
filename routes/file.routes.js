const {Router} = require('express')
const File = require('../models/File')
const auth = require('../middleware/auth.middleware')
const path = require('path')
const fs = require('fs')
const router = Router()

router.post('/file', auth, async (req, res) => {
    try {
        const file = req.files.files
        const types = file.name.split('.').pop()

        const path = `${__dirname}\\..\\uploads\\${req.user.userId}`
        const path_name = `${__dirname}\\..\\uploads\\${req.user.userId}\\${file.name}`

        const checkDoubleFile = await File.findOne({ name: file.name, owner: req.user.userId})

        if (checkDoubleFile) {
            return res.status(400).json({message: 'Файл уже существует'})
        }

        if (!fs.existsSync(path_name)) {
            try {
                if (fs.existsSync(path)) {
                    file.mv(path_name)
                }
                else {
                    fs.mkdirSync(path, { recursive: true })
                    file.mv(path_name)
                }

            } catch (error) {
                console.error(error)
            }
        } else {
            res.status(400).json({message: 'Файл уже существует'})
        }

        const images = new File({
            name: file.name, owner: req.user.userId, type: types
        })
        await images.save()
        res.status(201).json({message: 'Файл загружен'})

    }catch (e) {
        console.log(e)
        res.status(500).json({message: 'Ошибка загрузки файла'})
    }
})

router.get('/getFileInfo', auth, async (req, res) => {
    try {
        const files = await File.find({ owner: req.user.userId })
        res.json(files)
    }catch (e) {
        res.status(500).json({message: 'Что-то сломалось :('})
    }
})

router.post('/downloadFile', auth, async (req, res) => {
    try {
        console.log(req.body)
        const name = req.body.body
        const path = `${__dirname}\\..\\uploads\\${req.user.userId}\\${name}`

        if (fs.existsSync(path)) {
            return res.download(path, name)
        }
    }catch (e) {
        res.status(500).json({message: 'Что-то сломалось :('})
    }
})

router.post('/removeFile', auth, async (req, res) => {
    try {
        const file = req.body
        const path = `${__dirname}\\..\\uploads\\${req.user.userId}\\${file.fileName}`

        if (fs.existsSync(path)) {
            fs.rmSync(path, { recursive: true, force: true })
            await File.deleteOne({name: file.fileName, data: file.fileDate, owner: req.user.userId})
        }
        res.status(202).json({message: 'Файл удален'})

    }catch (e) {
        res.status(500).json({message: 'Что-то сломалось :('})
    }
})

module.exports = router