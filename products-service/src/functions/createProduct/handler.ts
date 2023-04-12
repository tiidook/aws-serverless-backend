import { formatJSONResponse, formatJSONResponseBadRequest } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
const dynamo = new DynamoDB.DocumentClient({region: 'us-east-1'})

const putProduct = async (item) => {
    return dynamo.put({
        TableName: process.env.ProductsTableName,
        Item: item
    }).promise()
}

const putStock = async (item) => {
    return dynamo.put({
        TableName: process.env.StocksTableName,
        Item: item
    }).promise()
}

const createProduct  = async (event) => {
    const { title, description, count, price } = event.body

    // Logging product fields
    console.log('title', title, 'description', description, 'count', count, 'price', price)

    if (!title) {
        return formatJSONResponseBadRequest()
    }
    const productId = uuidv4()

    const product = {
        id: productId,
        title,
        description,
        price
    }

    await putProduct(product)
    await putStock({ productId, count })

    return formatJSONResponse(product, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    });
};

export const main = middyfy(createProduct);
