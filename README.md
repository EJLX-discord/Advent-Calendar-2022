# EJLX Advent Calendar 2022

Welcome to the 6th annual Advent Calendar for the EJLX discord server!

This is the web archive for the event. I like to try a new library/framework each year, and this year was Next.js, although it might have been overkill and became sort of a hassle to work with part way for this.

The big new "feature" for this year is that it parses discord-flavoured markdown, meaning entries can now be recorded exactly how it would be written within Discord, instead of manually writing HTML. This means it should eventually, in theory, work with any bot that could extract the original messages from Discord (although emojis and attachments add some complexity here).

## Considerations

I could not find a reasonable way to import Javascript modules at static build time for NextJS, and JSON does not support multiline strings, which would make it difficult to just copy-paste entries from Discord. Instead, I use a third-party format called "Human-readable JSON (hjson)" which is sort of a weird mix between JSON and some YAML-like syntax. Here, we can also supply expected metadata.

### HJSON Format

The expected format for the entry data is:
```
{
  id: number;
  date: string;
  message: string;
  user: {
    id: string;
    username: string;
    discriminator: string;
    nickname: string;
    alt?: string;
    isGif?: boolean;
    hasServerIcon?: boolean;
    serverIconIsGif?: boolean;
    serverIconAlt?: string;
  };
  attachments: [{
    id: string;
    name: string;
    spoiler?: boolean;
    alt?: string;
  }...];
}
```
Keys with a question mark are optional and can be omitted.

### Naming format for media

When the build reads the data, it will try to match up user profile images, attachments, and emojis from the public/ folder using a strict naming scheme.

- Emojis must be a `.webp` or `.gif`, and following the naming scheme `${id}.${ext}`.
- Attachments follow the naming scheme `${id}.${filename}`
- User profiles must be `.webp` or `.gif`, and following the scheme `${user-id}.${ext}`. If they have a server profile, the additional file is given by `${user-id}--server.${ext}`





## Build

Install dependencies:
```
npm install
```

You can then start a dev server:
```
npm run dev
```

This opens the page on `localhost:3000`.

To build the final static page, use:
```
npm run export
```
and hope for the best.



