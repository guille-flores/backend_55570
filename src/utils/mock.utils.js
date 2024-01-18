import { faker } from '@faker-js/faker'

export const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({min:0}),
        thumbnail: faker.image.url(),
        code: faker.commerce.isbn(),
        stock: faker.number.int({min:0}),
        category: faker.commerce.department()
    }
}