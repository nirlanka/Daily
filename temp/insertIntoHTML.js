fs = require('fs')

var template=fs.readFileSync('one.html', 'utf8', function (err,data) {
  if (err) {
    console.log(err)
    return ''
  }

  template=data
});

// str.replace(regexp|substr, newSubStr|function[, flags])
template=template.replace('{{post}}', '<<post>>')

console.log(template)