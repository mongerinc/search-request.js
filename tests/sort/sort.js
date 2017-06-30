describe('sort', function()
{

	it("should have no sort when no sort is set", function()
	{
		var request = new SearchRequest;

		expect(request.getSort()).toBe(null);
		expect(request.getSorts()).toEqual([]);
	});

	it("should handle a single sort", function()
	{
		var request = new SearchRequest;

		request.sortBy('time', 'desc');

		expect(request.getSort().getField()).toBe('time');
		expect(request.getSort().getDirection()).toBe('desc');

		expect(request.getSorts()).toEqual([request.getSort()]);

		expect(request.getSort()).toEqual({field: 'time', direction: 'desc'});
	});

	it("should override sorts with sortBy", function()
	{
		var request = new SearchRequest;

		request.sortBy('time', 'desc');
		request.sortBy('size', 'asc');

		expect(request.getSort()).toEqual({field: 'size', direction: 'asc'});
	});

	it("should handle a multiple sort", function()
	{
		var request = new SearchRequest;

		request.addSort('time', 'desc').addSort('size', 'asc');

		expect(request.getSort().getField()).toBe('time');
		expect(request.getSort().getDirection()).toBe('desc');

		expect(request.getSorts()).toEqual([
			{field: 'time', direction: 'desc'},
			{field: 'size', direction: 'asc'},
		]);
	});

});