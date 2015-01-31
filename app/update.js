
var root='../'; // where to find the blog's root
fs = require('fs')

// READ META-DATA
var meta=require(root+'new/meta.json')
var newPostData={
	'title': meta['title'],
	'writer': meta['writer'],
	'intro': meta['intro'],
	'short-name': meta['short-name']
}

// CHECK IF `short-name` IS PUBLISHED
if (fs.existsSync(root+'p/'+meta['short-name']+'.html')) {
	console.log('error: already published in same `short-name`')
	process.exit()
};
// CHECK IF `short-name` IS NOT RENDERED
if (!fs.existsSync(root+'new/'+meta['short-name']+'.html')) {
	console.log('error: not rendered.')
	process.exit()
};

// PUBLISH FILE (add to `p/` dir)
var exec = require('child_process').exec
var child = exec(
	'mv '+
		root+'new/'+meta['short-name']+'.html'+
	' '+
		root+'p/'+meta['short-name']+'.html'+
	'; rm '+root+'new/content.html'
	,	function (error, stdout, stderr) {
		    console.log(stdout + 'Markdown rendered.');
		    console.log(stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
		}
);

// GET POST-TEMPLATE (for `index.html`)
var postTemplate=fs.readFileSync(
  root+'items/post.html', 'utf8', function (err,data) {
	  if (err) {
	    console.log(err)
	    return ''
	  }
	  return data
  }
);

// BUILD TIMELINE
var timelineData=require(root+'timeline-data.json')
timelineData['list'].push(newPostData) // update timeline (in-memory)

// RENDER TIMELINE
var thisPost, thisPostRendered, allPosts=''
for (var i = timelineData['list'].length - 1; i >= 0; i--) {
	thisPost=timelineData['list'][i]
	thisPostRendered=postTemplate
	// render all but {{link}} (per post)
	for (var k in thisPost) {
		if (k!='short-name') {
			thisPostRendered=
				thisPostRendered.replace('{{'+k+'}}', thisPost[k])
		}
	}
	// render {{link}}
	thisPostRendered=thisPostRendered.replace(
				'{{link}}',
				'p/'+thisPost['short-name']+'.html'
			)
	allPosts+=thisPostRendered
};

// UPDATE TIMELINE-DATA
fs.writeFile(
	root+'timeline-data.json',
	JSON.stringify(timelineData, null, 4),
	function (err) {
		if (err) {console.log(err);}
		else {console.log('`timeline-data.json` was updated.')}
	}
)

// RENDER INDEX PAGE
var indexTemplate=fs.readFileSync(
  root+'items/template.html', 'utf8', function (err,data) {
	  if (err) {
	    console.log(err)
	    return ''
	  }
	  return data
  }
);
indexTemplate=indexTemplate.replace('{{posts}}', allPosts)
fs.writeFile(
	root+'index.html',
	indexTemplate,
	function (err) {
		if (err) {console.log(err);}
		else {console.log('`index.html` was updated.')}
	}
)