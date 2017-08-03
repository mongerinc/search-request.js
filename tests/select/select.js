describe('group', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should have no default selects", function()
	{
		expect(request.selects).toEqual([]);
		expect(request.getSelects()).toEqual([]);
	});

	it("should allow adding a single select", function()
	{
		request.select('something');

		expect(request.selects).toEqual(['something']);
		expect(request.getSelects()).toEqual(['something']);
	});

	it("should allow adding a single array of selects", function()
	{
		request.select(['something', 'somethingElse']);

		expect(request.selects).toEqual(['something', 'somethingElse']);
		expect(request.getSelects()).toEqual(['something', 'somethingElse']);
	});

	it("should allow adding a multiple selects", function()
	{
		request.addSelect('something').addSelect('somethingElse');

		expect(request.selects).toEqual(['something', 'somethingElse']);
		expect(request.getSelects()).toEqual(['something', 'somethingElse']);
	});

	it("should allow adding multiple arrays of selects", function()
	{
		request.addSelect(['something']).addSelect(['somethingElse']);

		expect(request.selects).toEqual(['something', 'somethingElse']);
		expect(request.getSelects()).toEqual(['something', 'somethingElse']);
	});

	it("should allow overriding select", function()
	{
		request.select('something').select('somethingElse');

		expect(request.selects).toEqual(['somethingElse']);
		expect(request.getSelects()).toEqual(['somethingElse']);
	});

});