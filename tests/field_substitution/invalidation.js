describe('field substitution invalidation', function()
{
	var request = new SearchRequest;

	it("should not allow bad field values", function()
	{
		var badValues = [null, ['not a string'], 56.4, -5, 4, {}],
		    errorMessage = "Field subtitutions must consist of an original string and a substitution string.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.substituteField(badValue, 'someField');
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.substituteField('someField', badValue);
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.substituteFields({'someField': badValue});
			})
			.toThrowError(errorMessage);
		});
	});

	if("should not allow non-object multiple substitutions", function()
	{
		var badValues = [null, 56.4, -5, 4, 'not an object', []],
		    errorMessage = "Multiple field substitutions require an object mapping original to substitution strings.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.substituteFields(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

});