const puppeteer = require('puppeteer');

const ProfileInfo = require('./html-parsers/ProfileInfo');

module.exports = class GetProfileInfo
{
	static async factory(id = 'f108dd87-0202-41b4-99b6-b075323f68ea')
	{
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();

		await page.goto('https://app.earth2.io/#profile/' + id);

		let out = {properties: {}};

		let settingsSection = await page.evaluate(() => {return $('.settings-content').html()});

		ProfileInfo.runParseSettingsSection(settingsSection, out);

		while (true)
		{
			if (Object.keys(out['properties']).length >= out['info']['owns']) break;

			let innerHTML = await page.evaluate(() => $('.portfolio-content')[0].innerHTML);

			ProfileInfo.run(innerHTML, out);

			await page.evaluate(
				() =>
				{
					$('.pagination li.waves-effect a')[1].click();
				}
			);

			await new Promise(
				(resolve) =>
				{
					setTimeout(() => resolve(), 1700);
				}
			);
		}

		JSON.stringify(out, null, 4).to('../out.json');

		await browser.close();

		return out;
	}
}