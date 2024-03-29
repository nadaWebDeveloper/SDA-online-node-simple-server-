// import http from 'http'

// const http = require("http");
// const PORT = "8080";

// http
//   .createServer((req, res) => {
//     /* handle http requests */
//   })
//   .listen(PORT);

// console.log(`Server running at http://127.0.0.1:${PORT}/`);
////////
// import fs from 'fs/promises'


// const PRODUCTS =[
//     {id: 0 , title:'mac book pro', price: 54627},
//     {id: 1 , title:'iphone 14', price: 627},
//     {id: 2 , title:'printer', price: 327}
// ]


// const createProducts = async () => {

//     try {
//         await fs.writeFile('products.json' , JSON.stringify(PRODUCTS))
//         console.log(JSON.stringify(PRODUCTS));
        
//     } catch (error) {
//         console.log(error.message);
        
//     }

// }

// createProducts()


//better Formula to write code file read or write

// export const getAllProducts = async () =>
// {
//     try {
//         const product = await fs.readFile('products.json', 'utf-8')
//         return
//         // console.log(JSON.parse(product));
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// getAllProducts();



//to create & write into the file
// fs.writeFile('products.json', JSON.stringify(PRODUCTS),(error) => {

//     if(error){
//       console.log(error.message);
//     }else{
//       console.log(`file is created `,JSON.stringify(PRODUCTS) );
//     }
// } )


//to read from the file
// fs.readFile('products.json', 'utf-8' , (error, data) => {
//     if(error){
//         console.log(error.message);
//     }else{
//         console.log(data);
//     }
// })

// to delete the file
// fs.unlink('products.json', (error)=>{
//     if(error){
//         console.log(error.message);
//     }else{
//         console.log('is deleted');
//     }
// })
import http from 'http'
import fs from 'fs/promises'
import {parse} from 'querystring'
import 'dotenv/config'
import { error } from 'console';




// const http = require("http");
const PORT = process.env.PORT || 3002;



const requestsError = (res, statusCode, massage) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" })
  res.end(
    JSON.stringify({
      message: `${massage}`,
      fails: `fail to deleted `
    })
  )
}


const requestsSuccess = (res, statusCode, massage , payload = {}) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" })
  res.end(
    JSON.stringify({
      message: massage,
      payload: JSON.parse(payload)
    })
  )
}

const server = http.createServer(async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  const MATCH = req.url.match(/\/products\/([0-9]+)/);
  const ID = req.url?.split('/')[2]


  if (req.url === "/" && req.method === "GET") {
  try {
    requestsSuccess(res, 200, '<h1>Hello, World!</h1>')
    
  } catch (error) {

    requestsError(res, 500, error.massage)

  }


  } 
  else if ( req.url === "/products" && req.method === "GET") {
    try {
      const productFile = JSON.parse(await fs.readFile('products.json', 'utf-8'))
      console.log(productFile);
      requestsSuccess(res, 200, `returned all the product `,JSON.stringify(productFile))
    } catch (error) {

      requestsError(res, 500, error.massage)
    }
  }

  else if ( MATCH && req.method === "GET") {
    try {
      const productFile = JSON.parse(await fs.readFile('products.json', 'utf-8'))

      const product = productFile.find((product) => product.id === ID)
      if(!product) {
        requestsError(res, 404, `Product not found with ID ${ID}`)
        return;
      }
      requestsSuccess(res, 200, `returned a single product by id ${ID}`, JSON.stringify(product))
    } catch (error) {

      requestsError(res, 500, error.massage)
    }



  }
  else if (req.url === "/products" && req.method === "POST") {
    try {
   let body = ''
//receive data
   req.on('data', (chunk) => {
    body = body + chunk;
   })
   req.on('end',async () => {
    const data = parse(body)

    const newProduct = {
      id: new Date().getTime().toString(),
      title: String(data.title),
      price: Number(data.price)

    }
    console.log(newProduct);
    const existProduct = JSON.parse(await fs.readFile('products.json', 'utf-8'))

    existProduct.push(newProduct)

    await fs.writeFile('products.json', JSON.stringify(existProduct))

    requestsSuccess(res, 201, `created new  product `, existProduct)
  
   })

    } catch (error) {
      requestsError(res, 500, error.massage)
    }



  }
  // else if (req.url === "/" && req.method === "POST") {
  //   try {
  //     //receive data from client 
  //  let body = ''

  //  req.on('data', (data) => {
  //   body = body + data;
  //   console.log(body);
  //  })
  //        //send response to client 
  //  req.on('end', () => {
  //   const data = parse(body)
   
  //   requestsSuccess(res, 201, `Received data `, JSON.stringify(data))
  //  })

  //   } catch (error) {
  //     requestsError(res, 500, error.massage)
  //   }



  // } 
   else if ( MATCH && req.method === "DELETE") {
    try {
      const productFile = JSON.parse(await fs.readFile('products.json', 'utf-8'))
      const product = productFile.find((product) => product.id === ID)
      if(!product) {
        requestsError(res, 404, `Product want deleted not found with ID ${ID}`)
        return;
      }
      const filteredProducts = productFile.filter((product) => product.id !== ID);
      productFile  = filteredProducts;
      requestsSuccess(res, 200, `delete a single product by id ${ID}`)

    } catch (error) {
      requestsError(res, 500, error.massage)
    }



  } 
  else if ( MATCH && req.method === "PUT") {
    try {
      const productFile = JSON.parse(await fs.readFile('products.json', 'utf-8'))

      const product = productFile.find((product) => product.id === ID)
      if(!product) {
        requestsError(res, 404, `Product updated not found with ID ${ID}`)
        return
      }

      let body = ''
      req.on('data', (chunk) => {
       body = body + chunk;
      })
      req.on('end', () => {
    const updateData = parse(body)
    const {title, price} = updateData

    if(String(title)){
      console.log(product.title, ": " ,String(title));
         product.title =  String(title)
    }
    if(Number(price)){
      product.price =  Number(price)
     }
       requestsSuccess(res, 200, `product by Id ${ID} is updated`, JSON.stringify(product))
      })

    } catch (error) {
      requestsError(res, 500, error.massage)
    }


    
  }else{

    requestsError(res, 404, 'Router is not found')
  }
});


server.listen(PORT,() =>{
  console.log(`Server running at http://localhost:${PORT}/`);
})
