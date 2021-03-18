
require('shelljs/global');

console.clear();

(
	async () => 
	{
		let res = await require('./factories/CheckForTimer').factory();

		console.log('res:', res);

		JSON.stringify(res, null, 4).to('announcements.json');

		process.exit();
	}

)();