import { handlerPath } from '@libs/handler-resolver';
import {config} from "../../../config";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    environment: {
        ProductsTableName: config.ProductsTable,
        StocksTableName: config.StocksTable
    },
    events: [
        {
            http: {
                method: 'post',
                path: '/products',
                cors: true
            }
        },
    ],
};
