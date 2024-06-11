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
- [x] Grab page data for multiple IDs
  - [x] Parallelize with Promise.all
  - Load maybe 25 at a time
    - Loading 100 took 5 seconds
- Store block/page data in object with page ID as key
  - mock/getPageData has first 100 results
- Render all images for all pages
- Use fetch for now. SWR can wait
- Handle pagination when page_data has next_cursor