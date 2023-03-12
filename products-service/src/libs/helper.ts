import {Product, products} from "../mocks";

const findProduct = (productId: string) : Product => {
    return products.find((product) => {
        return product.id === productId;
    })
}

export default findProduct