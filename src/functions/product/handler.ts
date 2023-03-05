import {formatJSONResponse, formatJSONResponseNotFound} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from "aws-sdk";
const dynamo = new DynamoDB.DocumentClient({region: 'us-east-1'})

const scanProductsTable = async (id) => {
    const queryResults = await dynamo.query({
        TableName: process.env.ProductsTableName,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {':id' : id}
    }).promise();
    return queryResults.Items[0]
}

const scanStocksTable = async (id) => {
    const queryResults = await dynamo.query({
        TableName: process.env.StocksTableName,
        KeyConditionExpression: 'productId = :productId',
        ExpressionAttributeValues: {':productId' : id}
    }).promise();
    return queryResults.Items[0]
}

const getProductsById  = async (event) => {
    const productId = event.pathParameters.productId

    //Logging incoming product id
    console.log('productId', productId)

    const product = await scanProductsTable(productId)

    if (!product){
        return formatJSONResponseNotFound()
    }

    const stock = await scanStocksTable(productId)

    return formatJSONResponse({
        product: {...product, count: stock?.count || 0 }
    }, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    });
};

export const main = middyfy(getProductsById);
