const express = require('express'),
      mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      { body, validationResult } = require('express-validator');
const User = require('./models/user');
const usersRoutes = require('./routes/usersRoutes'),
      productsRoutes = require('./routes/productsRoutes'),
      cartRoute = require('./routes/cartRoute');
const app = express();


app.use(express.json());

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/cart', cartRoute);

app.post('/login',
    body('email')
        .notEmpty()
        .withMessage('Это поле обязательно')
        .isEmail()
        .withMessage('Неправильный формат почты'),
    body('password')
        .notEmpty()
        .withMessage('Это поле обязательно'),
    async (req, res) => {
    try {
        const { email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const candidate = await User.findOne({ email });

        if(!candidate) {
            return res
                .status(400)
                .json({ message: 'Неправильный логин или пароль.' });
        }

        const isSamePass = bcrypt.compareSync(password, candidate.password);
        console.log(isSamePass);

        if (!isSamePass) {
            return res
                .status(400)
                .json({ message: 'Неправильный логин или пароль.' });
        }

        return res.json(candidate);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

app.post(
    '/registration',
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
    async (req, res) => {
    try {
        const { email, password, age, name } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const candidate = await User.findOne({ email });

        if (candidate) {
            return res
                .status(400)
                .json({ message: 'Такая почта уже существует.' });
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const user = new User({
            email,
            password: hashPassword,
            age,
            name
        });

        await user.save();

        await res.json({ message: 'Вы успешно зарегистрованы.' });

    } catch (e) {
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте снова.' });
    }
})


const init = async () => {
    const MONGO_URL = 'mongodb+srv://aikanysh:v2uLy051DcvTucAq@cluster0.zxtpbjg.mongodb.net/?retryWrites=true&w=majority';

    await mongoose.connect(MONGO_URL);

    app.listen(5001, () => {
        console.log('SERVER HAS BEEN STARTED ON 5001');
    })
}

init();