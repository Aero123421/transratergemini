import os
import discord
from discord import app_commands

TOKEN = os.getenv("DISCORD_BOT_TOKEN")

class RSSBot(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        @self.tree.command(name="addrss", description="Subscribe to an RSS feed")
        @app_commands.describe(url="RSS feed URL")
        async def addrss(interaction: discord.Interaction, url: str):
            await interaction.response.send_message(f"Subscribed to {url}")

        await self.tree.sync()


def main():
    if not TOKEN:
        raise RuntimeError("DISCORD_BOT_TOKEN is not set")
    bot = RSSBot()
    bot.run(TOKEN)

if __name__ == "__main__":
    main()
