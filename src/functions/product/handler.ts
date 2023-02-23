import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import findProduct from "@libs/helper";


const getProductsById  = async (event) => {
    const productId = event.pathParameters.productId
    const product = findProduct(productId)

    return formatJSONResponse({
        product: product || null
    }, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    });
};

export const main = middyfy(getProductsById);
