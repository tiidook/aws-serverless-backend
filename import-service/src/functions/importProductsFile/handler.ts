import {formatInternalError, formatJSONResponse, formatJSONResponseNotFound} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk'

const importProductsFile = async (event) => {
  const fileName = event.pathParameters.name

  const s3 = new S3();

  if (!fileName) {
    return formatJSONResponseNotFound();
  }

  const bucketName = 'aws-csv-bucket'
  const params = {
    Bucket: bucketName,
    Key: `uploaded/${fileName}`,
    ContentType: 'text/csv'
  }

  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse({
      url: signedUrl
    }, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    });
  } catch (error) {
    return formatInternalError(error.message)
  }
};

export const main = middyfy(importProductsFile);
