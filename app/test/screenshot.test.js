jest.mock('@jnscas/app/public/puppeteerUtils', () => ({
  getBrowser: jest.fn(),
  closeBrowser: jest.fn(),
}));
const { getBrowser } = require('@jnscas/app/public/puppeteerUtils');
const { handleScreenshot } = require('@jnscas/app/public/screenshot');

const EVENT = 'event';

describe('handleScreenshot', () => {
  let browserMock, pageMock;

  beforeEach(() => {
    pageMock = {
      goto: jest.fn(),
      pdf: jest.fn().mockResolvedValue(Buffer.from('PDF content')),
      screenshot: jest.fn().mockResolvedValue(Buffer.from('Screenshot content')),
      close: jest.fn(),
    };
    browserMock = {
      newPage: jest.fn().mockResolvedValue(pageMock),
    };

    getBrowser.mockResolvedValue(browserMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should capture a screenshot when format is not pdf', async () => {
    const url = 'http://example.com';
    const format = 'png';

    const result = await handleScreenshot(EVENT, url, format);

    expect(getBrowser).toHaveBeenCalled();
    expect(browserMock.newPage).toHaveBeenCalled();
    expect(pageMock.goto).toHaveBeenCalledWith(url, { waitUntil: 'domcontentloaded' });
    expect(pageMock.screenshot).toHaveBeenCalled();
    expect(pageMock.pdf).not.toHaveBeenCalled();
    expect(pageMock.close).toHaveBeenCalled();
    expect(result.buffer).toEqual(Buffer.from('Screenshot content'));
    expect(result.error).toBeUndefined();
  });

  it('should capture a pdf when format is pdf', async () => {
    const url = 'http://example.com';
    const format = 'pdf';

    const result = await handleScreenshot(EVENT, url, format);

    expect(getBrowser).toHaveBeenCalled();
    expect(browserMock.newPage).toHaveBeenCalled();
    expect(pageMock.goto).toHaveBeenCalledWith(url, { waitUntil: 'domcontentloaded' });
    expect(pageMock.pdf).toHaveBeenCalled();
    expect(pageMock.screenshot).not.toHaveBeenCalled();
    expect(pageMock.close).toHaveBeenCalled();
    expect(result.buffer).toEqual(Buffer.from('PDF content'));
    expect(result.error).toBeUndefined();
  });

  it('should handle errors and return the error message', async () => {
    const url = 'http://example.com';
    const format = 'png';
    const error = new Error('Something went wrong');

    pageMock.goto.mockRejectedValue(error);

    const result = await handleScreenshot(EVENT, url, format);

    expect(getBrowser).toHaveBeenCalled();
    expect(browserMock.newPage).toHaveBeenCalled();
    expect(pageMock.goto).toHaveBeenCalledWith(url, { waitUntil: 'domcontentloaded' });
    expect(result.buffer).toBeUndefined();
    expect(result.error).toEqual(error.toString());
    expect(pageMock.close).not.toHaveBeenCalled();
  });
});
