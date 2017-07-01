describe('filter invalidation', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should not allow bad boolean values in where", function()
	{
		var badValues = [1, -5, 4.2, 'not a boolean string', false, null, {}, []];

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.where('foo', null, null, badValue);
			})
			.toThrowError("A filter's boolean needs to be either 'and' or 'or'.");
		});
	});

	it("should not allow adding bad filter sets", function()
	{
		var badValues = [1, -5, 4.2, 'not an object'];

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.addFilterSet(badValue);
			})
			.toThrowError("A filter set has to be an object.");
		});
	});

	it("should not allow adding bad filter set boolean", function()
	{
		var badValues = [1, -5, 4.2, 'not a boolean string', false, null, {}, []],
		    errorMessage = "A filter set's boolean needs to be either 'and' or 'or'.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.addFilterSet({boolean: badValue, filters: []});
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.addFilterSet({boolean: 'and', filters: [{boolean: badValue, filters: []}]});
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow adding bad filters", function()
	{
		var badValues = [1, -5, 4.2, 'not an array', {}],
		    errorMessage = "A filter set's filters have to be an array.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.addFilterSet({boolean: 'and', filters: badValue});
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.addFilterSet({boolean: 'and', filters: [{boolean: 'and', filters: badValue}]});
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow adding bad array filter values", function()
	{
		var badValues = [1, -5, 4.2, 'not an array', {}, false, null],
		    operators = ['in', 'not in', 'between', 'not between'];

		operators.forEach(function(operator)
		{
			badValues.forEach(function(badValue)
			{
				var errorMessage = "A filter with the '" + operator + "' operator must have an array value.";

				expect(function()
				{
					request.where('someField', operator, badValue);
				})
				.toThrowError(errorMessage);

				expect(function()
				{
					request['where' + toStudlyCase(operator)]('someField', badValue);
				})
				.toThrowError(errorMessage);
			});
		});

		function toStudlyCase(str)
		{
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/\s/g, '');
		}
	});

});