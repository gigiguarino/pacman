#!/bin/bash

height=$1
width=$2
path=$3
num=0

if [ -f "$path" ]
then
	rm $path
fi

touch $path

for (( i=0; i<$height; i++ ))
do
  for (( j=0; j<$width; j++ ))
  do
	  echo "<div class='tile'><img id='tile$num' src='beta_tiles/empty.png'></div>" >> $path
    num=`expr $num + 1`
  done
    echo "<br>" >> $path
done
