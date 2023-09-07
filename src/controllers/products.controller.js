import { productService } from "../services/index.js"
import CustomErrors from "../services/errors/Custom.errors.js"
import generateProductErrorInfo from "../services/errors/Info.errors.js"
import EnumErrors from "../services/errors/Enum.errors.js"

const getProducts = async (req, res) => {
    const currentUrl = req.protocol + "://" + req.get("host") + req.originalUrl
    const products = await productService.getProducts(req.query, currentUrl)
    res.json({ status: "success", data: products })
}

const getProduct = async (req, res) => {
    const { id } = req.params
    const product = await productService.getProduct(id)
    res.json({ status: "ok", data: product })
}

const updateProduct = async (req, res) => {
    const { title, description, code, price, stock, category } = req.body
    if ((!title || !description || !code || !price || !stock || !category) ||
        (typeof title != "string" || typeof description != "string" || typeof code != "number" || typeof price != "number" || typeof category != "string")) {
        CustomErrors.createError({
            name: "Product updating error",
            cause: generateProductErrorInfo(req.body),
            message: "Error trying to update product",
            code: EnumErrors.INVALID_TYPES_ERROR,
        })
    }
    const { id } = req.params
    const newProduct = req.body
    const updatedProduct = await productService.updateProduct(id, newProduct)
    res.json({ status: "ok", data: updatedProduct })
}

const createProduct = async (req, res) => {
    const product = req.body
    const createdProduct = await productService.createProduct(product)
    res.status(201).json({ status: "ok", data: createdProduct })
}

const deleteProduct = async (req, res) => {
    const { id } = req.params
    await productService.deleteProduct(id)
    res.sendStatus(204)
}

const generateProductsMock = async (req, res) => {
    const mockProducts = await productService.generateProductsMock()
    res.status(201).json({ status: "ok", data: mockProducts })
}

export default {
    getProducts,
    getProduct,
    updateProduct,
    createProduct,
    deleteProduct,
    generateProductsMock
}