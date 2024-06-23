// const ccxt = require("ccxt");
// const moment = require("moment");
import moment from "moment";
import ccxt from "ccxt";
import delay from "delay";
const binance = new ccxt.binance({
  apiKey: "cJb6P9TdoKXk2s47FAaw76XksTVdFzMwi0dV43mz8cd5puMTuDdcbdlWVDHwMxB7",
  secret: "Z8ifC7yicZ4eS7ObHqbxdMqX0wdYEsvWo1IadxfmSgrarm8vRXNshSXkIVjxFhpf",
});

binance.setSandboxMode(true);

async function printBalance(btcPrice) {
  const balance = await binance.fetchBalance();
  const total = balance.total;
  console.log(`Balance: BTC${total.BTC}, USDT: ${total.USDT}`);
  console.log(`Total USD: ${(total.BTC - 1) * btcPrice + total.USDT}. \n`);
}

async function tick() {
  const price = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
  const bprice = price.map((v) => {
    return {
      timestamp: moment(v[0]).format(),
      open: v[1],
      hight: v[2],
      low: v[3],
      close: v[4],
      volume: v[5],
    };
  });
  const averagePrice = bprice.reduce((acc, v) => acc + v.close, 0) / 5;
  const lastPrice = bprice[bprice.length - 1].close;
  ///
  const direction = averagePrice > lastPrice ? "buy" : "sell";
  const TRADE_SIZE = 100;
  const quantity = 100 / lastPrice;
  console.log(`Average price: ${averagePrice}. last price: ${lastPrice}.`);
  const order = await binance.createMarketOrder(
    "BTC/USDT",
    direction,
    quantity
  );
  console.log(
    `${moment().format()}: ${direction}${quantity} BTC at ${lastPrice}`
  );
  printBalance(lastPrice);
}
async function main() {
  while (true) {
    await tick();
    await delay(60 * 1000);
  }
}
main();
// printBalance();
// tick();
