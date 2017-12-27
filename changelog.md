## Changelog

### 5.4.0
- Adding the unlimited flag for ignoring pagination.

### 5.3.0
- Automatically resetting the page to 1 whenever a filter, term, sort, or grouping changes. Same for facets with the other filter/sort changes.

### 5.2.0
- Handle deep-cloning of the search request
- Avoid returning the search request from getFilter and getFilterValue methods

### 5.1.0
- Removing filters by name

### 5.0.0
- Added selects

### 4.0.0
- Added grouping

### 3.2.0
- Added regex filter operator
- Updated readme to include word operator companion methods.
- Added helper methods for `like` and `not like` filters.

### 3.1.1
- Bugfix: docs cleanup

### 3.1.0
- Added faceting

### 3.0.1
- Version bumping readme

### 3.0.0
- Add mechanism for changing all declared field names in the request to other values

### 2.1.0
- Added bower.json
- Added term property for global text searches

### 2.0.0
- Init release starting at major version 2 to sync with other SearchRequest libraries.