import * as dotenv from 'dotenv'
dotenv.config()

export const config = {
    ProductsTable : process.env.PRODUCTS_TABLE_NAME,
    StocksTable : process.env.STOCKS_TABLE_NAME
}