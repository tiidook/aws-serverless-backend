import { S3Event } from "aws-lambda";
import { S3 } from 'aws-sdk'

export const importFile = async (event: S3Event) => {
    const client = new S3({ region: 'us-east-1' });
    const objectName = event.Records[0].s3.object.key

    const metadata = {
        Bucket: 'aws-csv-bucket',
        Key: objectName
    }

    const results = []
    return new Promise((resolve) => {
        client.getObject(metadata).createReadStream().on('data', (data) => {
            console.log('Chunk', data);
            results.push(data)})
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