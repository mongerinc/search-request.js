## SearchRequest

This library provides a set of classes that help represent requests for complex data and provides a way to convert requests to and from a standard JSON format. If you have interfaces with tons of parameters ($filters, $groupings, $page, $rowsPerPage, etc.), or if you're just looking for a standard way to communicate complex requests to other apps without racking your brain over how to represent this data in JSON, you will like this library.

- **Version:** 1.2.0

[![Build Status](https://travis-ci.org/mongerinc/search-request.js.png?branch=master)](https://travis-ci.org/mongerinc/search-request.js)

Table of contents
-----------------
* [Installation](#installation)
* [Usage](#usage)
  * [JSON](#json)
  * [Sorting](#sorting)
  * [Pagination](#pagination)
  * [Filtering](#filtering)

### Installation

Install SearchRequest via bower by adding the following to the `require` block in your `bower.json` file:

```
"search-request": "1.*"
```