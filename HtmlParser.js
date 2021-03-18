
module.exports = class HtmlParser
{
	static parseObject(d)
	{
		let id, 
		    thumbnail, 
		    link, 
		    desc, 
		    price, 
		    tradeValue, 
		    tiles, 
		    location;

		let matches = /<a href="#propertyInfo\/(.*?)">/g.exec(d);

		id = matches[1];

		matches = /<a href="(#propertyInfo\/[a-zA-Z0-9 -]+)">/g.exec(d);

		link = matches[1];

		matches = /id="profile-landfield-img-[0-9]+".*src="(.*\.jpg)"/g.exec(d);

		thumbnail = matches[1];

		matches = /<div class="description">(.*?)<\/div>/g.exec(d);

		desc = matches[1];

		matches = /<div class="price">.*?([0-9\.]+).*?<span class="trade-value">.*<i class="material-icons">layers<\/i>.*?([0-9\.]+).*?<\/span>/g.exec(d);

		price = matches[1];

		tradeValue = matches[2];

		matches = /<div class="tile-count"><b>([0-9]+)<\/b> tiles<\/div>/g.exec(d);

		tiles = parseInt(matches[1]);

		matches = /data-land-centre="([0-9\.-]+) ([0-9\.-]+)"/g.exec(d);

		let loc = {
			long: matches[1],
			lat: matches[2],
		};

		matches = /<div class="coordinates">(.*?)<\/div>/g.exec(d);

		loc['location'] = matches[1]; 

		return {
			id, 
			thumbnail, 
			link, 
			desc, 
			price, 
			tradeValue, 
			tiles, 
			loc
		};
	}

	static runParseSettingsSection(ss, out)
	{
		let matches = /<img class="picture" alt="user picture" src="(.*?)">/g.exec(ss);
	
		let avatar = matches[1];

		matches = /<div class="name">(.*?)<\/div>/g.exec(ss);

		let alias = matches[1];

		matches = /<div class="description">Owns <b>([0-9]+)<\/b> Properties<\/div>/g.exec(ss);
	
		let owns = parseFloat(matches[1]);

		matches = /<div class="totaltiles">.*?<b>(.*?)<\/b>.*?<\/div>/.exec(ss);

		let tiles = parseInt(matches[1].replace(',', ''));

		matches = /<div class="networth">.*?<b>E\$(.*?)<\/b><\/div>/g.exec(ss);

		let networth = parseFloat(matches[1].replace(',', ''));

		matches = /<div class="profit">.*?<b>E\$(.*?) \((.*?)%\)<\/b><\/div>/g.exec(ss);
		
		let netProfit        = parseFloat(matches[1].replace(',', ''));
		let netProfitPercent = parseFloat(matches[2].replace(',', ''));

		out['info'] = {
			avatar,
			alias,
			owns,
			tiles,
			networth,
			netProfit,
			netProfitPercent,
		};
	}

	static run(html, out)
	{
		let bits = html.split('<div class="col-lg-4 col-md-6 col-12">');

		for (let d of bits)
		{
			if (!/<a href="#propertyInfo\/([a-zA-Z0-9 -]+)">/g.test(d)) continue;
			
			try
			{
				let obj = this.parseObject(d);

				out['properties'][obj.id] = obj;
			}
			catch (e) 
			{
				console.log('Error: ', e.message);
				console.log(d);
				process.exit();
			}
		}
	}
}