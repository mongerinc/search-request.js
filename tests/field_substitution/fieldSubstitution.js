describe('field substitution', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should handle select substitutions", function()
	{
		request.select(['first', 'second', 'third']);

		request.substituteFields({
			'first': 'subFirst',
			'third': 'subThird',
		});

		expect(request.getSelects()).toEqual([
			'subFirst', 'second', 'subThird'
		]);

		request.substituteField('second', 'subSecond');

		expect(request.getSelects()).toEqual([
			'subFirst', 'subSecond', 'subThird'
		]);
	});

	it("should handle sort substitutions", function()
	{
		request.addSort('first', 'asc').addSort('second', 'desc').addSort('third', 'asc');

		request.substituteFields({
			'first': 'subFirst',
			'third': 'subThird',
		});

		expect(request.getSorts()).toEqual([
			{field: 'subFirst', direction: 'asc'},
			{field: 'second', direction: 'desc'},
			{field: 'subThird', direction: 'asc'},
		]);

		request.substituteField('second', 'subSecond');

		expect(request.getSorts()).toEqual([
			{field: 'subFirst', direction: 'asc'},
			{field: 'subSecond', direction: 'desc'},
			{field: 'subThird', direction: 'asc'},
		]);
	});

	it("should handle group substitutions", function()
	{
		request.groupBy('first').groupBy('second').groupBy('third');

		request.substituteFields({
			'first': 'subFirst',
			'third': 'subThird',
		});

		expect(request.getGroups()).toEqual([
			'subFirst', 'second', 'subThird'
		]);

		request.substituteField('second', 'subSecond');

		expect(request.getGroups()).toEqual([
			'subFirst', 'subSecond', 'subThird'
		]);
	});

	it("should handle facet substitutions", function()
	{
		request.facetMany(['first', 'second']);

		request.substituteFields({
			'first': 'subFirst',
		});

		expect(request.getFacet('first')).toBe(undefined);
		expect(request.getFacet('subFirst')).toBeTruthy();
		expect(request.getFacet('second')).toBeTruthy();
	});

	it("should handle filter substitutions", function()
	{
		request.where('first', true)
		       .where('second', true)
		       .where(function(filterSet)
		       {
		           filterSet.where('third', true)
		                    .where('fourth', true)
		                    .where(function(filterSet)
		                    {
		                        filterSet.where('fifth', true)
		                                 .where('sixth', true);
		                    });
		       });

		request.substituteFields({
			'first': 'subFirst',
			'third': 'subThird',
			'fifth': 'subFifth',
		});

		expected = {
			boolean: 'and',
			filters: [
				{field: 'subFirst', value: true, operator: '=', boolean: 'and'},
				{field: 'second', value: true, operator: '=', boolean: 'and'},
				{
					boolean: 'and',
					filters: [
						{field: 'subThird', value: true, operator: '=', boolean: 'and'},
						{field: 'fourth', value: true, operator: '=', boolean: 'and'},
						{
							boolean: 'and',
							filters: [
								{field: 'subFifth', value: true, operator: '=', boolean: 'and'},
								{field: 'sixth', value: true, operator: '=', boolean: 'and'},
							]
						},
					]
				},
			],
		};

		expect(request.getFilterSet(), expected);

		request.substituteField('second', 'subSecond');

		expected.filters[1].field = 'subSecond';

		expect(request.getFilterSet(), expected);
	});

});