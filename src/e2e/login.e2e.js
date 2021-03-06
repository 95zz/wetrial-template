const BASE_URL = `http://localhost:${process.env.PORT || 9000}`;

describe('Login', () => {
  beforeAll(async () => {
    jest.setTimeout(1000000);
  });

  afterAll(async () => {
    if (!page.isClosed) {
      page.close();
    }
  });

  beforeEach(async () => {
    await page.goto(`${BASE_URL}/user/login`, { waitUntil: 'networkidle2' });
    // await page.evaluate(() => window.localStorage.setItem('antd-pro-authority', 'guest'));
  });

  it('should show password must input', async () => {
    await page.waitForSelector('#userName', {
      timeout: 2000,
    });
    await page.type('#userName', 'admin');
    // await page.type('#password', '11111');
    await page.click('button[type="submit"]');
    const selector = await page.waitForSelector('.ant-form-explain');
    expect(selector).toBeTruthy();
  });

  it('should login successfully', async () => {
    await page.waitForSelector('#userName', {
      timeout: 2000,
    });
    await page.type('#userName', 'admin');
    await page.type('#password', '111111');
    await page.click('button[type="submit"]');
    const result = await page.waitForResponse(
      response => response.url() === 'http://localhost:9000/api/user/login',
    );
    const json = await result.json();
    expect(json.success).toBe(false);
  });

  it('should login successfully', async () => {
    await page.waitForSelector('#userName', {
      timeout: 2000,
    });
    await page.type('#userName', 'admin');
    await page.type('#password', 'Abcd1234');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await jestPuppeteer.debug();
    // await page.waitForSelector('.ant-layout-sider h1'); // should display error
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain('<h1>Wetrial Template</h1>');
  });
});
