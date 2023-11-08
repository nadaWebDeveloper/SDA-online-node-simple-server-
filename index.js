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


let products = [
  { id: "0", title: "mac book pro", price: "12453" },
  { id: "1", title: "iphone 15", price: "6453" },
];

// const http = require("http");
const PORT = "8080";



const handleError = (res, statusCode, massage) => {
  res.writeHead(statusCode, { "Content-Type": "text/plain" })
  res.write(massage)
  res.end()
}


const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const MATCH = req.url.match(/\/products\/([0-9]+)/);
  const ID = req.url?.split('/')[2]

  if (req.url === "/" && req.method === "GET") {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Hello, World!</h1>");
    res.end();
    
  } catch (error) {
    handleError(res, 500, 'Server Error')

  }


  } else if ( MATCH && req.method === "GET") {
    try {
      const product = products.find((product) => product.id === ID)
      if(!product) {
        handleError(res, 404, `Product not found with ID ${ID}`)
      }
      console.log(ID);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(product));
      res.end();
    } catch (error) {
      handleError(res, 500, 'Server Error')
    }



  } else if (req.url === "/products" && req.method === "POST") {
    try {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write('New product is created');
      res.end();
    } catch (error) {
      handleError(res, 500, 'Server Error')
    }



  } else if ( MATCH && req.method === "DELETE") {
    try {
      const product = products.find((product) => product.id === ID)
      if(!product) {
        handleError(res, 404, `Product want deleted not found with ID ${ID}`)
      }
      console.log(`product by Id ${ID} is deleted`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(product));
      res.end();
    } catch (error) {
      handleError(res, 500, 'Server Error')
    }



  } else if ( MATCH && req.method === "PUT") {
    try {
      const product = products.find((product) => product.id === ID)
      if(!product) {
        handleError(res, 404, `Product updated not found with ID ${ID}`)
      }
      console.log(`product by Id ${ID} is updated`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(product));
      res.end();
    } catch (error) {
      handleError(res, 500, 'Server Error')
    }


    
  }else{

    handleError(res, 404, 'Router is not found')
  }
});


server.listen(PORT,() =>{
  console.log(`Server running at http://localhost:${PORT}/`);
})