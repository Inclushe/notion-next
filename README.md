# notion-next

## Getting Started

Create `.env.local` file and add `NOTION_SECRET` variable.

```bash
NOTION_SECRET=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then, run the development server:

```bash
bun dev
```

## Notes

- https://github.com/NotionX/react-notion-x
- Grab page data for multiple IDs
  - Parallelize with Promise.all
- Store block/page data in object with page ID as key
- Render all images for all pages
- Use fetch for now. SWR can wait
- Handle pagination when page_data has next_cursor