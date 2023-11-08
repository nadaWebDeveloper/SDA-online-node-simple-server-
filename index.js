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
import http from 'http'
import parse from 'querystring'


let products = [
  { id: "0", title: "mac book pro", price: "12453" },
  { id: "1", title: "iphone 15", price: "6453" },
];

// const http = require("http");
const PORT = "8080";



const requestsError = (res, statusCode, massage) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" })
  res.end(
    JSON.stringify({
      message: massage
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

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const MATCH = req.url.match(/\/products\/([0-9]+)/);
  const ID = req.url?.split('/')[2]

  if (req.url === "/" && req.method === "GET") {
  try {
    requestsSuccess(res, 200, '<h1>Hello, World!</h1>')
    
  } catch (error) {

    requestsError(res, 500, 'Server Error')

  }


  } else if ( req.url === "/products" && req.method === "GET") {
    try {
      const product = products.find((product) => product.id === ID)
      if(!product) {
        requestsError(res, 404, `Product not found with ID ${ID}`)
      }
      requestsSuccess(res, 200, `returned all the product `, product)
    } catch (error) {

      requestsError(res, 500, 'Server Error')
    }



  } 
  else if ( MATCH && req.method === "GET") {
    try {
      const product = products.find((product) => product.id === ID)
      if(!product) {
        requestsError(res, 404, `Product not found with ID ${ID}`)
        return
      }
      requestsSuccess(res, 200, `returned a single product by id ${ID}`, JSON.stringify(product))
    } catch (error) {

      requestsError(res, 500, 'Server Error')
    }



  } else if (req.url === "/products" && req.method === "POST") {
    try {
   let body = ''
   req.on('data', (chunk) => {
    body = body + chunk;
   })
   req.on('end', () => {
    const data = parse(body)
    const newProduct = {
      id: new Date().getTime().toString(),
      title: String(data.title),
      price: Number(data.price)

    }
    products.push(newProduct)
    requestsSuccess(res, 201, `created new  product `, JSON.stringify(product))
    console.log(`product by Id ${ID} is created`);
   })

    } catch (error) {
      requestsError(res, 500, 'Server Error')
    }



  } else if ( MATCH && req.method === "DELETE") {
    try {
      const product = products.find((product) => product.id === ID)
      if(!product) {
        requestsError(res, 404, `Product want deleted not found with ID ${ID}`)
        return
      }
      const filteredProducts = products.fill((product) => product.id !== ID);
      products = filteredProducts;
      requestsSuccess(res, 200, `delete a single product by id ${ID}`, JSON.stringify(product))
    } catch (error) {
      requestsError(res, 500, 'Server Error')
    }



  } else if ( MATCH && req.method === "PUT") {
    try {
      const product = products.find((product) => product.id === ID)
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
    if(String(data.title)){
         product.title =  String(updateData.title)
    }
    if(Number(data.price)){
      product.price =  Number(updateData.price)
     }
       products.push(newProduct)
       requestsSuccess(res, 201, `created new  product `, JSON.stringify(product))
       console.log(`product by Id ${ID} is updated`);
      })

    } catch (error) {
      requestsError(res, 500, 'Server Error')
    }


    
  }else{

    requestsError(res, 404, 'Router is not found')
  }
});


server.listen(PORT,() =>{
  console.log(`Server running at http://localhost:${PORT}/`);
})