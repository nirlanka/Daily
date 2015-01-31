var fs=require('fs')

var j={
	title: 'Post Title',
	writer: 'NirmalL',
	date: (new Date()).getHours()
}

fs.writeFile(
	'article.json',
	JSON.stringify(j, null, 4),
	function (err) {
		if (err) {console.log(err);}
		else {console.log('JSON saved.')}
	}
)