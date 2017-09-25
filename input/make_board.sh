#!/bin/bash

height=0
width=0
final_string=""
find_width=1

cd original_boards


for f in *
do
  # remove newlines
  # find height and width
  # height = number of newlines
  # width = spaces before newline 
  while read line
  do
    while read -n1 c
    do
      if [ "$find_width" -eq 1 ]
      then
        let "width=width+1"
      fi
      final_string=$final_string$c
    done < <(echo -n "$line")
    find_width=0
    let "height=height+1"
  done < "$f"

  new_file="../boards/"
  new_file=$new_file$f
  
  if [ -f $new_file ]
  then
    rm $new_file
  fi

  touch $new_file

  echo $height >> $new_file
  echo $width >> $new_file
  echo $final_string >> $new_file

  new_file="../divs/"
  new_file=$new_file$f

  source ../make_div.sh $height $width $new_file
done


