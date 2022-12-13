const { Router } = require('express');
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');
const router = Router();


router.get('/', async (req, res) => {
    try {
        const products = await Product.find();

        return res.json(products);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

router.get('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res
                .status(404)
                .json({ message: 'Товар не найден.' });
        }

        return res.json(product);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

router.post('/',
    body('title')
        .trim()
        .isLength({ max: 50, min: 1})
        .withMessage('В названии должно быть от 1 до 50 символов'),
    body('description')
        .trim()
        .isLength({ min: 1, max: 350 })
        .withMessage('В описании должно быть от 1 до 350 символов'),
    body('image')
        .notEmpty()
        .withMessage('Это поле обязательно')
        .isURL()
        .withMessage('Неправильно введена ссылка'),
    body('price')
        .notEmpty()
        .withMessage('Это поле обязательно')
        .isNumeric()
        .withMessage('Цена должна быть числом'),
    body('owner')
        .notEmpty()
        .withMessage('Это поле обязательно'),
    async (req, res) => {
    try {
        const { title, description, image, price, owner } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).jsonp({ errors: errors.array() })
        }

        const newProduct = new Product({
            title,
            description,
            image,
            price,
            owner
        });

        await newProduct.save();

        return res.status(201).json(newProduct);

    } catch (e) {
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте снова' });
    }
})

router.patch('/:id',
    body('title')
        .trim()
        .isLength({ max: 50, min: 1})
        .withMessage('В названии должно быть от 1 до 50 символов'),
    body('description')
        .trim()
        .isLength({ min: 1, max: 350 })
        .withMessage('В описании должно быть от 1 до 350 символов'),
    body('image')
        .notEmpty()
        .withMessage('Это поле обязательно')
        .isURL()
        .withMessage('Неправильно введена ссылка'),
    body('price')
        .notEmpty()
        .withMessage('Это поле обязательно')
        .isNumeric()
        .withMessage('Цена должна быть числом'),
    async (req, res) => {
    try {
        const { title, description, image, price, owner } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).jsonp({ errors: errors.array() })
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res
                .status(404)
                .json({ message: 'Товар не найден.' });
        }

        if (owner !== product.owner.toString()) {
            return res
                .status(400)
                .json({ message: 'Вы не можете отредактировать чужой товар.' });
        }

        Object.assign(product, {
            title: title || product.title,
            description: description || product.description,
            image: image || product.image,
            price: price || product.price
        })

        await product.save();

        return res.json(product);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ message: 'Товар не найден.'} );
        }

        Product.findByIdAndRemove(productId, (err) => {
            if (err){
                throw err;
            }

            return res.json({ message: 'Товар удален.' })
            });

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте еще раз.' });
    }
})


module.exports = router;