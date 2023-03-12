import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.importFile`,
    events: [
        {
            s3: {
                event: 's3:ObjectCreated:*',
                bucket: 'aws-csv-bucket',
                rules: [{
                    prefix: 'uploaded/',
                }],
                existing: true
            }
        },
    ],
};
