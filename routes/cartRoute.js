const { Router } = require('express');
const Cart = require('../models/cart');
const router = Router();


router.get('/:id', async (req, res) => {
    try{
        const userId = req.params.id;

        const cart = await Cart.find( { owner: userId } ).populate('product');

        res.json(cart);

    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте снова' });
    }
})

router.post('/', async (req, res) => {
    try{
        const { product, owner, quantity } = req.body;

        const newCartItem = new Cart({ product, owner, quantity })

        await newCartItem.save();

        res.status(201).json(newCartItem);

    } catch (e) {
        console.log(e)
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте снова' });
    }
})

router.patch('/:id', async (req, res) => {
    try{
        const cartItemId = req.params.id;
        const { quantity } = req.body;
        const cartItem = await Cart.findById(cartItemId);

        if(!cartItem) {
            return res.status(404).json({ message: 'Такого товара нет' })
        }

        Object.assign(cartItem, {quantity});

        await cartItem.save();

        return res.json(cartItem);

    } catch (e) {
        console.log(e)
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте снова' });
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const cartItemId = req.params.id;
        const cartItem = await Cart.findById(cartItemId);

        if(!cartItem) {
            return res.status(404).json({ message: 'Такого товара нет' });
        }

        await Cart.remove({ id: cartItemId });

        return res.json({ message: 'Товар успешно удален из корзины' })

    } catch (e) {
        console.log(e)
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так. Попробуйте снова' });
    }
})

module.exports = router;