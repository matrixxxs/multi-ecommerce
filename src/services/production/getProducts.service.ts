import pool from "../../config/db";

interface ProductTokens {
  stire_id: string;
  name: string;
  category: string;
}

interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  in_stock: boolean;
  category: string;
  price: number;
}

const getProduct = async (data: ProductTokens): Promise<Product> => {
  let query = `SELECT
    id,name,description,price,image_url,category,in_stock,store_id 
    FROM
    ecommerce.products 
    WHERE 1=1 
    AND
    store_id = $1 `;
  const value = [data.stire_id];
  if (data.category) {
    value.push(data.category);
    query += `AND category =  ${value.length}`;
  }
  if (data.name) {
    value.push(`%${data.name}%`);
    query += `AND ILIMT $${data.name}`;
  }
  const result = await pool.query<Product>(query, value);
};
