// export async function getBlockNumber() {
//   fetch(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       jsonrpc: "2.0",
//       method: "eth_getBlockByNumber",
//       params: [],
//       id: 2,
//     }),
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
// }
