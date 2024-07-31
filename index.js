const server = require("./server");

const { PORT } = process.env || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
