describe('group', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should have no default groups", function()
	{
		expect(request.groups).toEqual([]);
		expect(request.getGroups()).toEqual([]);
	});

	it("should allow adding a group", function()
	{
		request.groupBy('something');

		expect(request.groups).toEqual(['something']);
		expect(request.getGroups()).toEqual(['something']);
	});

	it("should allow adding a multiple groups", function()
	{
		request.groupBy('something').groupBy('somethingElse');

		expect(request.groups).toEqual(['something', 'somethingElse']);
		expect(request.getGroups()).toEqual(['something', 'somethingElse']);
	});

	it("should allow adding an array of groups", function()
	{
		request.groupBy(['something', 'somethingElse']);

		expect(request.groups).toEqual(['something', 'somethingElse']);
		expect(request.getGroups()).toEqual(['something', 'somethingElse']);
	});

	it("should allow adding multiple arrays of groups", function()
	{
		request.groupBy(['something']).groupBy(['somethingElse']);

		expect(request.groups).toEqual(['something', 'somethingElse']);
		expect(request.getGroups()).toEqual(['something', 'somethingElse']);
	});

});