
var root='../'; // where to find the blog's root
fs = require('fs')

// READ META-DATA
var meta=require(root+'new/meta.json')

// READ TEMPLATE HTML[S] (= WRAPPER)
var template=fs.readFileSync(root+'items/template.html', 'utf8', function (err,data) {
  if (err) {
    console.log(err)
    return ''
  }

  return data
});
var postTemplate=fs.readFileSync(root+'items/post.html', 'utf8', function (err,data) {
  if (err) {
    console.log(err)
    return ''
  }

  return data
});

// POST OBJECT (FOR TIMELINE)
var link='p/'+meta['short-name']+'.html'
var postData={
	'title': meta['title'],
	'writer': meta['writer'],
	'intro': meta['intro'],
	'link': link
}


var post=postTemplate

// RENDER SINGLE POST
for (var k in postData)
	post=post.replace('{{'+k+'}}', postData[k])

// WRITE SINGLE POST
var exec = require('child_process').exec,
    child;
child = exec(
	'cp '+
		root+'new/'+meta['short-name']+'.html'+
	' '+
		root+'p/'+meta['short-name']+'.html'
	,
	function (error, stdout, stderr) {
	    console.log(stdout + 'Markdown rendered.');
	    console.log(stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	}
);

// UPDATE TIMELINE
var timeline=require(root+'timeline.json')
timeline['list'].push(post)

// WRITE TIMELINE
fs.writeFile(
	root+'timeline.json',
	JSON.stringify(timeline, null, 4),
	function (err) {
		if (err) {console.log(err);}
		else {console.log('JSON (timeline) saved.')}
	}
)

// RENDER INDEX PAGE
for (var i = timeline['list'].length - 1; i >= 0; i--) {
	template=template.replace('{{posts}}', timeline['list'][i]+'{{posts}}')
};
template=template.replace('{{posts}}','')

// WRITE INDEX
fs.writeFile(
	root+'index.html',
	template,
	function (err) {
		if (err) {console.log(err);}
		else {console.log('Article saved locally.')}
	}
)