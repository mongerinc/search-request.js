## SearchRequest

This library provides a set of classes that help represent requests for complex data and provides a way to convert requests to and from a standard JSON format. If you have interfaces with tons of parameters (filters, groupings, page, rowsPerPage, etc.), or if you're just looking for a standard way to communicate complex requests to other apps without racking your brain over how to represent this data in JSON, you will like this library.

- **Version:** 5.4.0

[![Build Status](https://travis-ci.org/mongerinc/search-request.js.png?branch=master)](https://travis-ci.org/mongerinc/search-request.js)

Also see:

[Search Request for PHP](https://github.com/mongerinc/search-request)

Table of contents
-----------------
* [Installation](#installation)
* [Usage](#usage)
  * [JSON](#json)
  * [Selection](#selection)
  * [Sorting](#sorting)
  * [Grouping](#grouping)
  * [Pagination](#pagination)
  * [Filtering](#filtering)
  * [Faceting](#faceting)
  * [Field Substitution](#field-substitution)

### Installation

Install SearchRequest via bower by adding the following to the `require` block in your `bower.json` file:

```
"search-request": "5.*"
```

### Usage

When creating a `SearchRequest` from scratch, you first need to instantiate it:

```javascript
request = new SearchRequest;
```

As a starting point, each search request has no sorts, no filters, and no groupings. Pagination starts at page 1 and by default there is a limit of 10 rows per page.

#### JSON

Using the `toJson()` method, each `SearchRequest` instance can be compiled into a JSON string that you can use to communicate across application boundaries.

```
request.toJson();
```

Likewise, you can build a new `SearchRequest` instance using a JSON string that was compiled by a `SearchRequest` instance.

```
request = new SearchRequest(json);
```

#### Selection

The most common method of setting selections on the request is by using the `select()` method which overrides any existing selects:

```javascript
request.select(['field1', 'field2']);
```

If you want to add to existing selects, you can call the `addSelect()` method instead. You can chain this method:

```javascript
request.addSelect('field1').addSelect('field2');
```

Retrieving the set of selects is done by the `getSelects()` method.

```javascript
request.getSelects();
```

#### Sorting

The most common method of sorting the request is by using the `sortBy()` method which overrides any existing sorts:

```javascript
request.sortBy('field', 'asc');
```

The first parameter in any sort call is the string field and the second parameter is the sort direction which is limited to `asc` and `desc`.

If you want to create a request with multiple sorts, you can call the `addSort()` method instead. You can chain this method:

```javascript
request.addSort('field', 'asc').addSort('otherField', 'desc');
```

If you want to retrieve the sorts, you can either call the `getSort()` method to get the primary sort, or you can call `getSorts()` to get the array of all sorts. Each sort is represented by a `Sort` instance where you can ask for the field and the direction:

```javascript
sort = request.getSort();

databaseQuery.orderBy(sort.getField(), sort.getDirection());
```

#### Grouping

Grouping a `SearchRequest` can be done using the `groupBy()` method. The `groupBy()` method takes either a string or an array of strings as an input. The method can also be chained.

```javascript
request.groupBy('field').groupBy('anotherField');

request.groupBy(['field', 'anotherField']);
```

Retrieving the set of groups is done by the `getGroups()` method.

```javascript
request.getGroups();
```

#### Pagination

Creating a new `SearchRequest` defaults to page 1 and a limit of 10 rows per page. If you want to modify this, you can call the `setPage()` and `setLimit()` methods:

```javascript
request.setPage(5).setLimit(40);
```

If you want to simply go to the next page, you can call the `nextPage()` method and it will increment the current page by 1.

Retrieving the page and limit is done by the methods `getPage()` and `getLimit()`:

```javascript
limit = request.getLimit();
page = request.getPage();

databaseQuery.take(limit).skip((page - 1) * limit);
```

Alternatively, you can call `getSkip()` to avoid doing the calculation above.

If you want to ignore the pagination for a request, you can call the `unlimited()` or `all()` methods.

```javascript
request = request.unlimited();

if (!request.isUnlimited())
   databaseQuery.take(request.getLimit()).skip(request.getSkip());
```

The unlimited feature is only a flag. Your database query applier must check for this with the `isUnlimited()` method to support this feature.

#### Filtering

Filtering a `SearchRequest` can be done using the `where()` method. An operator can be provided as the second argument where the possible types are `=`, `>`, `>=`, `<`, `<=`, `!=`, `in`, `not in`, `like`, `not like`, `regex`, `not regex`, `exists`, `not exists`, `between`, and `not between`. If no operator is provided, it is assumed to be `=`.

```javascript
request.where('someField', '>=', 5.45)
       .where('isFun', true);            //assumed to be an equality
```

Each of the word-like operators (`in`, `like`, `regex`, `exists`, `between`) has a set of four companion helper methods. These follow this general format:

```javascript
request.where{Word}(field, value)
       .orWhere{Word}(field, value)
       .whereNot{Word}(field, value)
       .orWhereNot{Word}(field, value);

//example:
request.whereLike(field, value)
       .orWhereLike(field, value)
       .whereNotLike(field, value)
       .orWhereNotLike(field, value);
```

Reading filters from the search request can be done using the `getFilterSet()` method and calling `getFilters()` on it:

```javascript
request.getFilterSet().getFilters().forEach(function(filter)
{
	databaseQuery.where(filter.getField(), filter.getOperator(), filter.getValue());
});
```

You can also call `getFilter(field)` or `getFilterValue(field)` on the `SearchRequest` or `FilterSet` to get the `Filter`/value respectively of the first filter that matches that field name. This is useful if your filters are relatively simple and you only expect one value for each field name.

```javascript
request.where('foo', true);
request.where('foo', '>', 5);

request.getFilterValue('foo'); //true
request.getFilters().getFilterValue('foo'); //true
```

More complex filtering can be accomplished by using nested conditions. Assuming you wanted to make a request representing the following pseudo-SQL conditional statement:

```sql
...WHERE goodTimes = true AND (profit > 1000 OR revenue > 1000000)
```

...you would do the following...

```javascript
request.where('goodTimes', true)
       .where(function(filterSet)
       {
           filterSet.where('profit', '>', 1000)
                    .orWhere('revenue', '>', 1000000);
       });
```

When reading a complex set of conditionals back from the `SearchRequest`, there are several important concepts to understand:

1. Each nesting layer (including the top layer) is represented by a `FilterSet`. A `FilterSet` has a boolean (and/or) and can be comprised of any combination of `Filter` and `FilterSet` objects. These objects are provided in the order they were entered.
2. A `Filter` object represents a field, value, and conditional operator along with a boolean (and/or).

Since the nesting of conditionals is theoretically infinite, you may want to implement a recursive function to apply the request to the library of your choice (like a database query builder).

It's also possible to remove filters by name:

```javascript
request.where('foo', 1).where('moo', 2).where('goo', 3);

request.removeFilters('foo').removeFilters(['moo', 'goo']);
```

#### Faceting

Faceting (i.e. getting attribute values and their counts) a `SearchRequest` can be done like this:

```javascript
facet = request.facet('someField');
```

This will create a facet for `someField` and, unlike other methods, returns a `Facet` instance instead of the `SearchRequest`. You can also create multiple facets at once:

```javascript
request.addFacets(['someField', 'someOtherField']);
```

This will return the `SearchRequest`.

And you can get facets either one at a time by field name (will only return the first match):

```javascript
request.getFacet('someField');
```

Or all at once:

```javascript
request.getFacets();
```

Sorting a facet's results can be done either by count or value (the default) and a direction.

```javascript
facet.isCountSorting(); //bool
facet.isValueSorting(); //bool
facet.getSortDirection(); //'asc' or 'desc'

facet.sortByCount();
facet.sortByValue();
facet.setSortDirection('asc');
```

The minimum number of values a facet field must have in order to be returned in the result set is 1.

```javascript
facet.getMinimumCount(); //1

facet.setMinimumCount(5);
```

Filters that exist for the facet's field are by default excluded from consideration when building the facet results.

```javascript
facet.shouldExcludeOwnFilters(); //true

facet.excludeOwnFilters();
facet.includeOwnFilters();
```

A facet can also be paginated just like the search request and with the same default values:

```javascript
facet.getPage();
facet.getLimit();
facet.getSkip();

facet.setPage(5).setLimit(100);
facet.nextPage();
```

#### Field Substitution

When making search requests, you often want to keep the specifics of a data storage schema hidden from the rest of your code base. For example, you may have a denormalized SQL field called `category_name` on your `products` table that on the way out gets formatted as:

```javascript
{
  ...
  'category': {
    'id': product.category_id,
    'name': product.category_name,
  },
  ...
}
```

So the rest of your system sees `category.name` as the field, but your SQL repository only understands `category_name`. This is where field substitution comes in handy:

```javascript
//abstract layer code
request.where('category.name', 'Foo');

//then later in the repository
request.substituteField('category.name', 'category_name');
```

You can also substitute many fields at once by passing in an array of `original`: `substitution` values:

```javascript
request.substituteFields(
  {'category.name': 'category_name'},
  {'category.id': 'category_id'},
);