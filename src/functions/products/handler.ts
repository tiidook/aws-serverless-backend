import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {products} from "../../mocks";


const getProducts = async () => {
  return formatJSONResponse({
    products: products
  },{
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });
};

export const main = middyfy(getProducts);
