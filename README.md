# CalNatSci-TS V2

CalNatSci Discord Bot rewritten in TypeScript.

[![Node.js CI](https://github.com/redstripez08/CalNatSci-TS/actions/workflows/node.js.yml/badge.svg?branch=v2)](https://github.com/redstripez08/CalNatSci-TS/actions/workflows/node.js.yml)

[![Docker Image CI](https://github.com/redstripez08/CalNatSci-TS/actions/workflows/docker-image.yml/badge.svg?branch=v2)](https://github.com/redstripez08/CalNatSci-TS/actions/workflows/docker-image.yml)

**Disclaimer: This bot is not affiliated with CalNatSci**  
I might change the name of the bot and repo at some point eventually. Dunno, the reason i named it
like this is because it was originally handle school stuff for myself and some friends, such as Wikipedia searching and some other fun commands. I was going to use the Google Classroom API to show new assignments and announcements right in Discord, but i gave up since the authorization process is confusing AF and the packages are large AF as well.

**I'm not making the bot public.** You can copy the code if you want to, but you will have to create your own bot since this is sort of used for my own server. This means you have to supply your own PostgreSQL database as well.

The bot does stuff for my server. It handles warnings, polls, role-reacts and stuff like that.
This bot became a lot larger and complex than I expected it to. It handles some database stuff
with MongoDB and SQLite, and now can run in Docker Containers. The bot now has a web server as well so i can update it over the internet.

It now has a Docker Image and `docker-compose.yml` for worker (bot) and web (server).
