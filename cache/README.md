# Cache Directory

This directory stores Swagger JSON files for change detection.

## Files

- `swagger-latest.json` - Most recently fetched Swagger JSON
- `swagger-previous.json` - Previous version for comparison

## Usage

These files are automatically managed by the generator:
- Fetched during each generation run
- Compared to detect API changes
- Preserved between runs for diffing

## .gitignore

You may want to add this directory to `.gitignore` if you don't want to track Swagger snapshots in version control.
