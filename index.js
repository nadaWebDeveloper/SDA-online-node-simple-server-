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

let products = [
  { id: "0", title: "mac book pro", price: "12453" },
  { id: "1", title: "iphone 15", price: "6453" },
];

const http = require("http");
const PORT = "8080";

const handleError = (res, statusCode, massage) => {
  res.writeHead(statusCode, { "Content-Type": "text/plain" })
  res.write(massage)
  res.end()
}


const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/" && req.method === "GET") {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Hello, World!</h1>");
    res.end();
    
  } catch (error) {
    handleError(res, 500, 'Server Error')

  }


  } else if (req.url === "/products" && req.method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(products));
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



  } else if (req.url === "/products" && req.method === "DELETE") {
    try {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write('Product is deleted');
      res.end();
    } catch (error) {
      handleError(res, 500, 'Server Error')
    }



  } else if (req.url === "/products" && req.method === "PUT") {
    try {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write('Product is updated');
      res.end();
    } catch (error) {
      handleError(res, 500, 'Server Error')
    }


    
  }
});


server.listen(PORT,() =>{
  console.log(`Server running at http://localhost:${PORT}/`);
})