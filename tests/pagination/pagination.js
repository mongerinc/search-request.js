describe('pagination', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should have default values", function()
	{
		expect(request.page).toEqual(1);
		expect(request.getPage()).toEqual(1);
		expect(request.limit).toEqual(10);
		expect(request.getLimit()).toEqual(10);
	});

	it("should respect new values", function()
	{
		request.setPage(5).setLimit(50);

		expect(request.page).toEqual(5);
		expect(request.getPage()).toEqual(5);
		expect(request.limit).toEqual(50);
		expect(request.getLimit()).toEqual(50);
		expect(request.getSkip()).toEqual(200);
	});

	it("should go to the next page", function()
	{
		request.nextPage();

		expect(request.page).toEqual(2);
		expect(request.getPage()).toEqual(2);
		expect(request.getSkip()).toEqual(10);
	});

	it("should respect integer-like strings", function()
	{
		request.setPage('2').setLimit('100');

		expect(request.page).toEqual(2);
		expect(request.getPage()).toEqual(2);
		expect(request.limit).toEqual(100);
		expect(request.getLimit()).toEqual(100);
		expect(request.getSkip()).toEqual(100);
	});
});