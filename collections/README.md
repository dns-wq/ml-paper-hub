# Paper Collections

Curated reading lists that anyone can import into Paper Hub.

## How to Use

1. Open Paper Hub
2. Click the **Import** button (upload icon) in the header
3. Select a `.json` collection file
4. Papers will be merged into your library (existing papers won't be duplicated)

## How to Contribute a Collection

1. Export your papers from Paper Hub (download icon in header)
2. Edit the JSON to include only the papers you want to share
3. Add a `name` and `description` field at the top level
4. Submit a PR to this directory

### Collection Format

```json
{
  "name": "Collection Name",
  "description": "What this collection covers and who it's for",
  "curator": "Your Name",
  "papers": [
    {
      "id": "unique-paper-id",
      "title": "Paper Title",
      "authors": "Author et al.",
      "year": 2024,
      "category": "Category Name",
      "difficulty": 3,
      "url": "https://arxiv.org/abs/...",
      "source": "user",
      "abstract": "Paper abstract text..."
    }
  ]
}
```

## Available Collections

| Collection | Papers | Description |
|---|---|---|
| [ilya-30.json](ilya-30.json) | 23 | Ilya Sutskever's recommended reading list |
| [karpathy-list.json](karpathy-list.json) | 14 | Andrej Karpathy's essential ML papers |
