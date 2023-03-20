import {handlerPath} from "../../libs/handler-resolver";
import {config} from "../../../config";

export default {
    handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
    environment: {
        ProductsTableName: config.ProductsTable,
        StocksTableName: config.StocksTable
    },
    events: [{
        sqs: {
            batchSize: 5,
            arn: {
                'Fn::GetAtt': [
                    'SQSCatalogItems',
                    'Arn'
                ]
            },
        }
    }]
};
