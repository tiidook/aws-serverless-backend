import { SQSEvent } from "aws-lambda";

export const catalogBatchProcess = (event: SQSEvent) => {
    console.log('event', event)
    console.log('event REcords', event.Records)
    console.log('event REcords 00', event.Records[0].body)
    return { statusCode: 200 }
}

