import {DynamoDB} from 'aws-sdk'
import {formatJSONResponse} from '../../libs/api-gateway';
import {middyfy} from '../../libs/lambda';

const dynamo = new DynamoDB.DocumentClient({region: 'us-east-1'})

const scanProductsTable = async () => {
  const results = await dynamo.scan({
    TableName: process.env.ProductsTableName
  }).promise();
  return results.Items
}

const scanStocksTable = async () => {
  const results = await dynamo.scan({
    TableName: process.env.StocksTableName
  }).promise();
  return results.Items
}

const getProducts = async () => {
  const products = await scanProductsTable()
  const stocks = await scanStocksTable()

  const joinedProducts = products.map((product) => {
      const stock = stocks.find((stock) => stock.productId === product.id)
      return {...product, count: stock?.count || 0}
  })

  return formatJSONResponse({
    products: joinedProducts
  },{
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });
};

export const main = middyfy(getProducts);
