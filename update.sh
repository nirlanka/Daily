cat new/meta.html index-part.html > temp-index-part.html
rm index-part.html
mv temp-index-part.html index-part.html

cat items/navbar.html index-part.html > temp-index.html
rm index.html
mv temp-index.html index.html