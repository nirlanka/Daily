
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
var postDataObj={
	'title': meta['title'],
	'writer': meta['writer'],
	'intro': meta['intro'],
	'short-name': meta['short-name']
}


var post=postTemplate
// console.log(post)

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
var timeline=[]
// console.log(timeline)
// var timeline=require(root+'timeline.json')
var timelineData=require(root+'timeline-data.json')
// console.log(timelineData)
for (var i = 0; i < timelineData['list'].length; i++) {
	var tempPost=postTemplate
	// console.log(tempPost)
	var link='p/'+timelineData['list'][i]['short-name']+'.html'
	var tempPostData={
		'title': timelineData['list'][i]['title'],
		'writer': timelineData['list'][i]['writer'],
		'intro': timelineData['list'][i]['intro'],
		'link': link
	}
	// console.log(tempPostData)
	for (var k in tempPostData)
		tempPost=tempPost.replace('{{'+k+'}}', tempPostData[k])
	timeline.push(tempPost)
	// console.log(timeline)
};
// timeline['list'].push(post)
timelineData['list'].push(postDataObj)

// WRITE TIMELINE
// fs.writeFile(
// 	root+'timeline.json',
// 	JSON.stringify(timeline, null, 4),
// 	function (err) {
// 		if (err) {console.log(err);}
// 		else {console.log('`timeline.json` saved.')}
// 	}
// )
fs.writeFile(
	root+'timeline-data.json',
	JSON.stringify(timelineData, null, 4),
	function (err) {
		if (err) {console.log(err);}
		else {console.log('`timeline-data.json` saved.')}
	}
)

// RENDER INDEX PAGE
for (var i = timeline.length - 1; i >= 0; i--) {
	template=template.replace('{{posts}}', timeline[i]+'{{posts}}')
};
template=template.replace('{{posts}}','')
// console.log(template)

// WRITE INDEX
fs.writeFile(
	root+'index.html',
	template,
	function (err) {
		if (err) {console.log(err);}
		else {console.log('Article saved locally.')}
	}
)