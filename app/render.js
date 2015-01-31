
var root='../'; // where to find the blog's root

// RENDER MARKDOWN (ALREADY DONE IN `render.sh`)
/*var exec = require('child_process').exec,
    child;
child = exec(
	'markdown '+
		root+'new/content.md'+
	' > '+
		root+'new/content.html',
	function (error, stdout, stderr) {
	    console.log(stdout + 'Markdown rendered.');
	    console.log(stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	}
);*/

// READ META-DATA
var meta=require(root+'new/meta.json')

fs = require('fs')

// CHECK IF `short-name` IS PUBLISHED
if (fs.existsSync(root+'p/'+meta['short-name']+'.html')) {
	console.log('ERR: Published file exists (with the same `short-name`).')
	process.exit()
};

// RENDER DATE
if (meta['date']=='') {meta['date']=new Date();}
else meta['date']=new Date(meta["date"])
// console.log(meta['date'])

// DEFAULT SHORT-NAME FOR ARTICLE
if (meta['short-name']=='') {
	// SET DEFAULT `short-name`
	var status=require(root+'status.json')
	status['short-name']=''+(parseInt(status['short-name'])+1)
	meta['short-name']=''
	// UPDATE `status.json`
	fs.writeFile(
		root+'status.json',
		JSON.stringify(status, null, 4),
		function (err) {
			if (err) {console.log(err);}
			else {console.log('`status.json` was updated.')}
		}
	)
	// UPDATE `meta.json`
	// fs.writeFile(
	// 	root+'new/meta.json',
	// 	JSON.stringify(meta, null, 4),
	// 	function (err) {
	// 		if (err) {console.log(err);}
	// 		else {console.log('`meta.json` was updated.')}
	// 	}
	// )
	meta['short-name']=status['short-name']
};

// READ TEMPLATE HTML (= WRAPPER)
var template=fs.readFileSync(root+'new/template.html', 'utf8', function (err,data) {
  if (err) {
    console.log(err)
    return ''
  }

  return data
});

// READ THE RENDERED HTML
meta['content']=fs.readFileSync(root+'new/content.html', 'utf8', function (err,data) {
  if (err) {
    console.log(err)
    return ''
  }

  return data ;console.log(data)
});

// RENDER THE TEMPLATE
for (var k in meta) {
	if (k!='intro') {};
	template=template.replace('{{'+k+'}}', meta[k])
};

// SAVE THE ARTICLE (LOCALLY ONLY)
fs.writeFile(
	root+'new/'+meta['short-name']+'.html',
	template,
	function (err) {
		if (err) {console.log(err);}
		else {console.log('Article saved locally.')}
	}
)
