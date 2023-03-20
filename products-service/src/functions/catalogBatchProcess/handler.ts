import { SQSEvent } from "aws-lambda";
import { Product } from "../../types";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
import { SNS } from 'aws-sdk'

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
export const catalogBatchProcess = async (event: SQSEvent) => {
    const sns = new SNS({ region: 'us-east-1' })
    const products: Product[] = JSON.parse(event.Records[0].body)
    for (const product of products){
        const productId = uuidv4()
        await putProduct({...product, id: productId})
        await putStock({ productId, count: product.count })
    }

    await sns.publish({
        Subject: 'Product',
        Message: 'Product is created',
        TopicArn: process.env.SNS_ARN
    }, () => {
        console.log('Sent email from', JSON.stringify(products))
    }).promise()
    return { statusCode: 200 }
}

