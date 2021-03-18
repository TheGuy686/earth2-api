const puppeteer = require('puppeteer');


Date.prototype.addDays = function(days) {
	this.setDate(this.getDate() + days);
	return this;
}

Date.prototype.addHours = function(h) {
	this.setTime(this.getTime() + (h*60*60*1000));
	return this;
}

Date.prototype.addMins = function(m) {
	this.setMinutes(this.getMinutes() + m);
	return this;
}

Date.prototype.addSecs = function(s) {
	this.setSeconds(this.getSeconds() + s);
	return this;
}

module.exports = class GetProfileInfo
{
	static async factory()
	{
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();

		await page.goto('https://earth2.io', {waitUntil: 'networkidle2',});

		let countDownHtml = await page.evaluate(() => {return document.getElementsByClassName('hero-countdown')[0].innerHTML});

		if (!countDownHtml) return false;

		let matches = countDownHtml.match(/<h3.*>([\w\W\s\S\d\D]+)<\/h3>/);

		let announcement = matches[1].replace(/\\n/g, '').trim();

		matches = countDownHtml.match(/<span class="hero-countdown__digit">([0-9]+)<\/span>/gm);

		let timeArr = [];

		for (let d of matches)
		{
			let m = d.match(/([0-9]+)/);

			timeArr.push(m[1]);
		}

		let currentTs = new Date();

		let secs = 0;

		switch (timeArr.length)
		{
			case 1: 

				// and lastly add the seconds
				secs += parseInt(timeArr[0]);

				break;

			case 2:

				// add the min secs
				secs += timeArr[0] * 60;

				// and lastly add the seconds
				secs += parseInt(timeArr[1]);

				break;

			case 3: 

				// add the hours secs
				secs += timeArr[0] * 60 * 60;

				// add the min secs
				secs += timeArr[1] * 60;

				// and lastly add the seconds
				secs += parseInt(timeArr[2]);

				break;

			case 4: 

				// add the days secs
				secs += (24 * timeArr[0]) * 60 * 60;

				// add the hours secs
				secs += timeArr[1] * 60 * 60;

				// add the min secs
				secs += timeArr[2] * 60;

				// and lastly add the seconds
				secs += parseInt(timeArr[3]);
		}

		currentTs.setSeconds(currentTs.getSeconds() + (secs - 2));

		return {
			announcements: [
				{
					announcement,
					endTs: currentTs.getTime(),
				}
			]
		}
	}
}