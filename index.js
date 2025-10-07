import { Telegraf } from "telegraf";
import axios from "axios";

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🧠 Commands
bot.start((ctx) => ctx.reply("👋 Hello! I’m your bot.\n\nCommands:\n/weather [city]\n/verse\n/define [word]\n/chat [message]"));

bot.command("weather", async (ctx) => {
  const city = ctx.message.text.split(" ").slice(1).join(" ");
  if (!city) return ctx.reply("🌤️ Please provide a city. Example: /weather Manila");

  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_KEY}&units=metric`
    );
    const w = res.data;
    ctx.reply(
      `🌤️ Weather in ${w.name}, ${w.sys.country}:\n${w.weather[0].description}\n🌡️ ${w.main.temp}°C`
    );
  } catch (err) {
    ctx.reply("⚠️ City not found. Try shorter names like `/weather Batangas` or `/weather San Jose PH`.");
  }
});


bot.command("verse", async (ctx) => {
  const res = await axios.get("https://bible-api.com/john%203:16");
  const v = res.data;
  ctx.reply(`📖 ${v.reference}\n${v.text}`);
});

bot.command("define", async (ctx) => {
  const word = ctx.message.text.split(" ").slice(1).join(" ");
  if (!word) return ctx.reply("📘 Example: /define love");

  try {
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const meaning = res.data[0].meanings[0].definitions[0].definition;
    ctx.reply(`📚 ${word}: ${meaning}`);
  } catch {
    ctx.reply("❌ Word not found.");
  }
});

bot.command("chat", async (ctx) => {
  const message = ctx.message.text.split(" ").slice(1).join(" ");
  if (!message) return ctx.reply("💬 Example: /chat hello bot");
  ctx.reply("🤖 (AI simulation) You said: " + message);
});

bot.launch();
console.log("✅ Bot is running...");

