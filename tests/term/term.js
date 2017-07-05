describe('term', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should have no default search term", function()
	{
		expect(request.term).toEqual(null);
	});

	it("should allow adding a term", function()
	{
		request.setTerm('something');

		expect(request.term).toEqual('something');
	});

});