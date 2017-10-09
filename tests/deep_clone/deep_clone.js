describe('deep clone', function()
{
	it("should deep clone", function()
	{
		var originalRequest = new SearchRequest,
			newRequest;

		originalRequest.where('something', true);

		newRequest = originalRequest.clone();

		originalRequest.where('somethingElse', false);

		expect(newRequest.getFilterValue('somethingElse')).toBe(undefined);
	});
});