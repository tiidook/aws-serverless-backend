import { S3Event } from "aws-lambda";
import { S3, SQS } from 'aws-sdk'
const csv = require('csv-parser')

export const importFile = async (event: S3Event) => {
    const client = new S3({ region: 'us-east-1' });
    // const ssm = new SSM({ region: 'us-east-1' })
    const sqs = new SQS({ region: 'us-east-1' })

    // const sqsUrl = await ssm.getParameter({Name: '/parameter/sqs-catalog-items-sqs/queue-arn'}).promise()

    const objectName = event.Records[0].s3.object.key

    const metadata = {
        Bucket: 'aws-csv-bucket',
        Key: objectName
    }
    const results = []
    const params = {
        MessageAttributes: {
            Author: {
                DataType: "String",
                StringValue: "Andrei",
            }
        },
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/697593023229/catalogItemsQueue'
    };

    return new Promise((resolve) => {
        client.getObject(metadata).createReadStream()
            .pipe(csv())
            .on('data', (data) => {
                console.log('Chunk', data);
                sqs.sendMessage({...params, MessageBody: JSON.stringify(data)})
            })
            .on('end', () => {
                console.log('File Results', results);
                resolve({statusCode: 202})
            })
            .on('error', (error) => {
                console.log('error', error)
                resolve({statusCode: 500})
            });

    })
}