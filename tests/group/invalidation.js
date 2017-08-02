describe('group invalidation', function()
{
	it("should not allow non-string terms", function()
	{
		var request = new SearchRequest,
			badValues = [56.4, -5, 45, {}, [1], [{}]];

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.groupBy(badValue);
			})
			.toThrowError("It's only possible to add a string or an array of strings of groups.");
		});
	});

});