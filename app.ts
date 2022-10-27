require("dotenv").config();
import { Context, Telegraf } from "telegraf";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Update } from "typegram";
import { ethers } from "ethers";

const TOKEN = process.env.TOKEN as string;
const SERVER_URL = process.env.SERVER_URL as string;
const PORT = process.env.PORT as unknown as number || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;
let chatId: any;
const bot: Telegraf<Context<Update>> = new Telegraf(
  process.env.TOKEN as string
);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the bot API endpoint
app.use(bot.webhookCallback(WEBHOOK_URL));
bot.telegram.setWebhook(WEBHOOK_URL);
app.listen(process.env.PORT || 5000, async () => {
  console.log("🚀 app running on port", process.env.PORT || 5000);
});


const groups = <any>[];

const address = "0x7b423bb11d596b408d873a96ee583b83af7b99cc";
const abi: any = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "string", name: "baseTokenURI", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  }
];
const init = async () => {

  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed1.binance.org"
  );
  const contract = new ethers.Contract(address, abi, provider);

  let options = {
    filter: {
      value: [],
    },
  };

  const sendMessage = async (message: any) => {
    if (groups.length > 0) {
      for (let group of groups) {
        const remainingNFTS = await contract.lastSupply();
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: group,
          text: message + `\n*Remaining NFT's:* ${remainingNFTS}/2222`,
          parse_mode: "Markdown",
        });
      }
    }
  };
  let topic = ethers.utils.id("Transfer(address,address,uint256)");
  let filter = {
    address: address,
    topics: [topic],
  };
  provider.on(filter, (result) => {
    console.log(result);
    bot.telegram.sendMessage(
      "-",
      `<b></b> mint!  #${Number(result.topics[3])} \n\n <a href="https://ipfs.io/ipfs//${Number(result.topics[3])}.png">&#8205;</a>`,
      {parse_mode: 'HTML'}
    );
  });
  console.log("ping");
};
init();

app.post(URI, async (req, res) => {
  let text;
  let newGroup = true;
  try {
      chatId = req.body.message.chat.id;
      text = req.body.message.text;
      if (text == '/bot') {
          if (groups.length <= 2) {
              console.log(chatId);
              if (groups.length === 0) {
                  groups[0] = chatId;
                  console.log(groups);
                  await axios.post(`${TELEGRAM_API}/sendMessage`, {
                      chat_id: chatId,
                      text: `* Bot Activated with chat id:* ${chatId}`,
                      parse_mode: 'Markdown',
                  });
              } else {
                  for (let group of groups) {
                      if (group === chatId) {
                          console.log('Already activated');
                          console.log(groups);
                          newGroup = false;
                      }
                  }
                  if (newGroup) {
                      groups[groups.length] = chatId;
                      console.log(groups);
                      try {
                          await axios.post(`${TELEGRAM_API}/sendMessage`, {
                              chat_id: chatId,
                              text: `* Bot Activated with chat id:* ${chatId}`,
                              parse_mode: 'Markdown',
                          });
                      } catch (err) {
                          console.log(err);
                      }
                  }
              }
          } else {
              console.log('Too many groups');
          }
      }
  } catch (err) {
      console.log(err);
  }
  return res.send();
});