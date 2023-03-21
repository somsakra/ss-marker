import http from "http";
import app from "./app";

const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, () => console.log(`server is running on port ${port}`));
