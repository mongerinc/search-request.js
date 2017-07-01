describe('sort', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should have no sort when no sort is set", function()
	{
		expect(request.getSort()).toBe(null);
		expect(request.getSorts()).toEqual([]);
	});

	it("should handle a single sort", function()
	{
		request.sortBy('time', 'desc');

		expect(request.getSort().getField()).toBe('time');
		expect(request.getSort().getDirection()).toBe('desc');

		expect(request.getSorts()).toEqual([request.getSort()]);

		expect(request.getSort()).toEqual({field: 'time', direction: 'desc'});
	});

	it("should override sorts with sortBy", function()
	{
		request.sortBy('time', 'desc');
		request.sortBy('size', 'asc');

		expect(request.getSort()).toEqual({field: 'size', direction: 'asc'});
	});

	it("should handle adding multiple independent sorts", function()
	{
		request.addSort('time', 'desc').addSort('size', 'asc');

		expect(request.getSort().getField()).toBe('time');
		expect(request.getSort().getDirection()).toBe('desc');

		expect(request.getSorts()).toEqual([
			{field: 'time', direction: 'desc'},
			{field: 'size', direction: 'asc'},
		]);
	});

	it("should handle adding multiple sorts", function()
	{
		request.addSorts([
			{field: 'time', direction: 'desc'},
			{field: 'size', direction: 'asc'},
		]);

		expect(request.getSorts()).toEqual([
			{field: 'time', direction: 'desc'},
			{field: 'size', direction: 'asc'},
		]);
	});

});