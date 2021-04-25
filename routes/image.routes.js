const {Router} = require('express')
const Image = require('../models/Image')
const auth = require('../middleware/auth.middleware')
const path = require('path')
const fs = require('fs')
const router = Router()

router.post('/file', auth, async (req, res) => {
    try {
        const file = req.files.files
        const types = file.name.split('.').pop()
        const existing = await Image.findOne({name: file.name, type: types})

        if (existing) {
            return res.json({image: existing})
        }

        const path = `${__dirname}\\..\\uploads\\${req.user.userId}`
        const path_name = `${__dirname}\\..\\uploads\\${req.user.userId}\\${file.name}`

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

        const images = new Image({
            name: file.name, owner: req.user.userId, type: types
        })
        await images.save()
        res.status(201).json({message: 'Файл загружен'})

    }catch (e) {
        console.log(e)
        res.status(500).json({message: 'Ошибка загрузки файла'})
    }
})

router.get('/getfile', auth, async (req, res) => {
    try {
        const files = await Image.find({ owner: req.user.userId })
        res.json(files)
    }catch (e) {
        res.status(500).json({message: 'Что-то сломалось :('})
    }
})

router.post('/openfile', auth, async (req, res) => {
    try {
        console.log(req.body)
        const name = req.body.body
        const path = `${__dirname}\\..\\uploads\\${req.user.userId}\\${name}`
        if (fs.existsSync(path)) {
            console.log(path)
            return res.download(path, name)
        }
    }catch (e) {
        res.status(500).json({message: 'Что-то сломалось :('})
    }
})

module.exports = router