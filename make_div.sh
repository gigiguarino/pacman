
height=$1
width=$2
path=$3

if [ -f "$path" ]
then
	rm $path
fi

touch $path

num=`expr $height \* $width`

for (( i=0; i<$num; i++ ))
do
	echo "<div class='tile' id='tile$i'></div>" >> $path
done
