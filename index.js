require("dotenv").config();
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const puppeteer = require("puppeteer");
const url = "https://www.reddit.com/r/FreeGameFindings/"; //Enter The Page To Be Liked Here
let browser;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const openBrowser = async () => {
  browser = await puppeteer.launch({
    args: ["--start-maximized"],
    headless: true,
  });
};

openBrowser();

const prefix = "!";

client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "maal") {
    message.reply("Ruko Jara Maal Dhoondh Rha....").then(async (msg) => {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36 OPR/75.0.3969.267"
      );

      await page.goto(url);

      await page.waitForNetworkIdle();

      let allGames = await page.evaluate(() =>
        [...document.querySelectorAll("._2FCtq-QzlfuN-SwVMUZMM3")].map(
          (elem) => {
            if (elem && elem.innerText) {
              return elem.innerText;
            } else {
              return null;
            }
          }
        )
      );

      await page.close();

      const remove = /Expired|\(DLC\)|\[IndieGala\]|Oculus|\[itch.io\]/g;
      const keep = /\(Game\)|\(Beta\)|\(Other\)/g;

      allGames = allGames.filter((val) => val !== null);

      allGames = allGames.map((val) => {
        if (remove.test(val)) {
          return null;
        }
        newVal = val.split("\n");
        const temp = newVal.map((value) => {
          if (!remove.test(value) && keep.test(value)) {
            return value;
          }
        });
        return temp;
      });

      allGames = allGames
        .filter((val) => val !== null)
        .map((val) => val.filter((val) => val !== undefined))
        .filter((val) => val.length)
        // .slice(0, 5)
        .join("\n");

      msg.delete();

      message.reply(allGames);
    });
  } else if (command === "sum") {
    const numArgs = args.map((x) => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => (counter += x));
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  }
});

client.login(process.env.CLIENT_TOKEN); //login bot using token
