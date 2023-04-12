import { S3Event } from "aws-lambda";
import { S3, SQS } from 'aws-sdk'
const csv = require('csv-parser')

export const importFile = async (event: S3Event) => {
    const client = new S3({ region: 'us-east-1' });
    const sqs = new SQS({ region: 'us-east-1' })

    const objectName = event.Records[0].s3.object.key

    const metadata = {
        Bucket: 'aws-csv-bucket',
        Key: objectName
    }

    const products = await new Promise((resolve) => {
        const results = []
        client.getObject(metadata).createReadStream()
            .pipe(csv())
            .on('data',  (data) => {
                console.log('Chunk', data);
                results.push(data)
            })
            .on('end', () => {
                console.log('File Results', results);
                resolve(results)
            })
    })

    const params = {
        MessageAttributes: {
            Author: {
                DataType: "String",
                StringValue: "Andrei",
            }
        },
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/697593023229/catalogItemsQueue',
        MessageBody: JSON.stringify(products)
    };
    try {
        await sqs.sendMessage(params).promise()
        return { statusCode: 200 }
    } catch (e){
        return { statusCode: 500 }
    }
}