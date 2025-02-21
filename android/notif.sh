echo "Please set a search filter"
read search

adb shell dumpsys alarm | grep $search | (while read i; do echo $i; _DT=$(echo $i | grep -Eo 'when\s+([0-9]{10})' | tr -d '[[:alpha:][:space:]]'); if [ $_DT ]; then echo -e "\e[31m$(date -d @$_DT)\e[0m"; fi; done;)
