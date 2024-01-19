export const generateProductErrorInfo = (product) => {
    return `One or more properties were invalid.
    List of required properties:
    * title: needs to be a string, received ${product.title}.
    * price: needs to be a number greater than 0, received ${product.price}.
    * code: needs to be a string, received ${product.code}.
    * stock: needs to be an integer greater than 0, received ${product.stock}.
    `
}  