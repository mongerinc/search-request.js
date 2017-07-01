describe('filter', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should have a default empty state", function()
	{
		var filterSet = request.getFilterSet();

		expect(filterSet.filters.length).toBe(0);
		expect(filterSet.getFilters().length).toBe(0);

		expect(filterSet.boolean).toBe('and');
		expect(filterSet.getBoolean()).toBe('and');
		expect(filterSet.isAnd()).toBe(true);
		expect(filterSet.isOr()).toBe(false);
	});

	it("should handle a simple equality", function()
	{
		request.where('someField', true);

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [{field: 'someField', operator: '=', value: true, boolean: 'and'}]
		});
	});

	it("should handle multiple filters on the same field", function()
	{
		request.where('someField', false).where('someField', '>=', 40.24);

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [
				{field: 'someField', operator: '=', value: false, boolean: 'and'},
				{field: 'someField', operator: '>=', value: 40.24, boolean: 'and'},
			]
		});
	});

	it("should handle all valid operators", function()
	{
		var operators = ['=', '>', '>=', '<', '<=', '!=', 'in', 'not in', 'like', 'not like', 'exists', 'not exists', 'between', 'not between'],
		    expectedFilters = [],
		    arrayOperators = ['in', 'not in', 'between', 'not between'],
		    iteration = 1;

		operators.forEach(function(operator)
		{
			var field = 'a' + iteration++,
			    value = arrayOperators.indexOf(operator) === -1 ? 'some value' : [1, 2];

			request.where(field, operator, value);

			expectedFilters.push({field: field, operator: operator, value: value, boolean: 'and'});
		});

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: expectedFilters
		});
	});

	it("should handle a simple or", function()
	{
		request.where('something', false).orWhere('somethingElse', '>=', 56.24);

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [
				{field: 'something', operator: '=', value: false, boolean: 'and'},
				{field: 'somethingElse', operator: '>=', value: 56.24, boolean: 'or'},
			]
		});
	});

	it("should handle a nested or", function()
	{
		request.where('something', false).where(function(filterSet)
		{
			filterSet.where('innerThing', '<', -45).orWhere('secondInnerThing', 'potatoes');
		});

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [
				{field: 'something', operator: '=', value: false, boolean: 'and'},
				{
					boolean: 'and',
					filters: [
						{field: 'innerThing', operator: '<', value: -45, boolean: 'and'},
						{field: 'secondInnerThing', operator: '=', value: 'potatoes', boolean: 'or'},
					]
				},
			]
		});
	});

	it("should handle a deep nested or", function()
	{
		request.where('something', true).where(function(filterSet)
		{
			filterSet.where('innerThing', 43.23).orWhereIn('secondInnerThing', ['burlap', 'sacks']).orWhere(function(filterSet)
			{
				filterSet.where('france', 'large').where('bananas', 'small');
			});
		});

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [
				{field: 'something', operator: '=', value: true, boolean: 'and'},
				{
					boolean: 'and',
					filters: [
						{field: 'innerThing', operator: '=', value: 43.23, boolean: 'and'},
						{field: 'secondInnerThing', operator: 'in', value: ['burlap', 'sacks'], boolean: 'or'},
						{
							boolean: 'or',
							filters: [
								{field: 'france', operator: '=', value: 'large', boolean: 'and'},
								{field: 'bananas', operator: '=', value: 'small', boolean: 'and'},
							]
						},
					]
				},
			]
		});
	});

	it("should handle all 'in' filters", function()
	{
		request.whereIn('first', [1, 2, 3])
		       .whereNotIn('second', ['four', 'five', 'six'])
		       .orWhereIn('third', [7, 8, 9])
		       .orWhereNotIn('fourth', ['ten', 'eleven', 'twelve']);

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [
				{field: 'first', operator: 'in', value: [1, 2, 3], boolean: 'and'},
				{field: 'second', operator: 'not in', value: ['four', 'five', 'six'], boolean: 'and'},
				{field: 'third', operator: 'in', value: [7, 8, 9], boolean: 'or'},
				{field: 'fourth', operator: 'not in', value: ['ten', 'eleven', 'twelve'], boolean: 'or'},
			]
		});
	});

	it("should handle all 'between' filters", function()
	{
		request.whereBetween('first', [1, 2])
		       .whereNotBetween('second', [3, 4])
		       .orWhereBetween('third', [5, 6])
		       .orWhereNotBetween('fourth', [7, 8]);

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [
				{field: 'first', operator: 'between', value: [1, 2], boolean: 'and'},
				{field: 'second', operator: 'not between', value: [3, 4], boolean: 'and'},
				{field: 'third', operator: 'between', value: [5, 6], boolean: 'or'},
				{field: 'fourth', operator: 'not between', value: [7, 8], boolean: 'or'},
			]
		});
	});

	it("should handle all 'exists' filters", function()
	{
		request.whereExists('first')
		       .whereNotExists('second')
		       .orWhereExists('third')
		       .orWhereNotExists('fourth');

		expect(request.getFilterSet()).toEqual({
			boolean: 'and',
			filters: [
				{field: 'first', operator: 'exists', value: null, boolean: 'and'},
				{field: 'second', operator: 'not exists', value: null, boolean: 'and'},
				{field: 'third', operator: 'exists', value: null, boolean: 'or'},
				{field: 'fourth', operator: 'not exists', value: null, boolean: 'or'},
			]
		});
	});

	it("should pluck nothing if no filters exist", function()
	{
		request.where('someField', false);

		expect(request.getFilterSet().getFilter('someOtherField')).toEqual(undefined);
		expect(request.getFilterSet().getFilterValue('someOtherField')).toEqual(undefined);
	});

	it("should pluck the first filter instance of a field", function()
	{
		request.where('someField', false).where('someField', '>=', 40.24);

		expect(request.getFilterSet().getFilter('someField')).toEqual({field: 'someField', operator: '=', value: false, boolean: 'and'});
		expect(request.getFilterSet().getFilterValue('someField')).toEqual(false);
	});

	it("should add a raw filter set", function()
	{
		var filterSet = {
				boolean: 'and',
				filters: [
					{field: 'something', operator: '=', value: false, boolean: 'and'},
					{
						boolean: 'and',
						filters: [
							{field: 'innerThing', operator: '<', value: -45, boolean: 'and'},
						]
					},
				]
			};

		request.addFilterSet(filterSet);

		expect(request.getFilterSet()).toEqual(filterSet);
	});

});