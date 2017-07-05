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
		expect(request.getTerm()).toEqual(null);
	});

	it("should allow adding a term", function()
	{
		request.setTerm('something');

		expect(request.term).toEqual('something');
		expect(request.getTerm()).toEqual('something');
	});

	it("should allow nullifying a term", function()
	{
		request.setTerm('something');
		request.setTerm(null);

		expect(request.term).toEqual(null);
		expect(request.getTerm()).toEqual(null);
	});

});