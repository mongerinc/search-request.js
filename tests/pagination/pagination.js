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

	it("should reset page by default", function()
	{
		request.setPage(5).where('foo', true);
		expect(request.getPage()).toEqual(1);

		request.setPage(5).sortBy('foo', 'desc');
		expect(request.getPage()).toEqual(1);

		request.setPage(5).groupBy('foo');
		expect(request.getPage()).toEqual(1);

		request.setPage(5).setTerm('foo');
		expect(request.getPage()).toEqual(1);
	});

	it("should not reset page when disabled", function()
	{
		request.disableAutomaticPageReset();

		request.setPage(5).where('foo', true);
		expect(request.getPage()).toEqual(5);

		request.setPage(5).sortBy('foo', 'desc');
		expect(request.getPage()).toEqual(5);

		request.setPage(5).groupBy('foo');
		expect(request.getPage()).toEqual(5);

		request.setPage(5).setTerm('foo');
		expect(request.getPage()).toEqual(5);
	});

	it("should reset page when reenabled", function()
	{
		request.disableAutomaticPageReset().enableAutomaticPageReset();

		request.setPage(5).where('foo', true);
		expect(request.getPage()).toEqual(1);
	});

	it("should respect unlimited values", function()
	{
		expect(request.isUnlimited()).toEqual(false);

		request.setUnlimited();
		expect(request.isUnlimited()).toEqual(true);

		request.setUnlimited(false);
		expect(request.isUnlimited()).toEqual(false);

		request.all();
		expect(request.isUnlimited()).toEqual(true);
	});

	it("should falsify unlimited when setting pagination", function()
	{
		request.setUnlimited().setPage(1);
		expect(request.isUnlimited()).toEqual(false);

		request.setUnlimited().setLimit(1);
		expect(request.isUnlimited()).toEqual(false);
	});
});