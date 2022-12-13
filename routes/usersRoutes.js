const { Router } = require('express');
const User = require('../models/user');
const router = Router();
const { body, validationResult } = require('express-validator');


router.get('/', async (req, res) => {
    try {
        const users = await User
            .find()
            .select(['-password']);

        return res.json(users);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

router.get('/:id', async (req, res) => {
    try{
        const candidate = await User
            .findById(req.params.id)
            .select(['-password']);

        if (!candidate) {
            return res
                .status(404)
                .json('Пользователь с таким id не найден.');
        }

        return res.json(candidate);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

router.patch('/:id',
    body('email')
        .isEmail()
        .withMessage('Неправильный формат почты'),
    body('password')
        .isLength({ min: 8, max: 20 })
        .withMessage('В пароле должно быть от 8 до 20 символов'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Это поле обязательно'),
    body('age')
        .isNumeric()
        .withMessage('Возраст должен быть числом')
        .notEmpty()
        .withMessage('Это поле обязательно'),
    async (req, res) => {
    try {
        const { email, name, password, age } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            res
                .status(404)
                .json({ message: 'Пользователь с таким id не найден.' })
        }

        Object.assign(user, {
            email: email || user.email,
            name: name || user.name,
            password: password || user.password,
            age: age || user.age
        })

        await user.save();

        return res.json(user);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            res
                .status(404)
                .json('Пользователь с таким id не найден.')
        }

        User.findByIdAndRemove(userId, (err) => {
            if (err){
                throw err;
            }

            return res.json({ message: 'Пользователь удален.' })
        });

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

module.exports = router;