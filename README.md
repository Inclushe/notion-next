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

### Done

- https://github.com/NotionX/react-notion-x
- [x] Grab page data for multiple IDs
  - [x] Parallelize with Promise.all
  - Load maybe 25 at a time
    - Loading 100 took 5 seconds
- [x] Store block/page data in object with page ID as key
  - [x] mock/getPageData has first 100 results
- [x] Render all images for all pages
- [x] Use fetch for now. SWR can wait

### Doing

- Handle pagination when page_data has next_cursor
  - Load when bottom of page is reached
  - Use intersection observer from https://courses.joshwcomeau.com/joy-of-react/07-framer-motion/02.01-basics-exercises#springy-toasty
- Save data and images to local storage

- If rate limited, wait for Retry-After seconds
  - https://developers.notion.com/reference/request-limits