#!/bin/bash

for i in {1..40}
do
  echo "Request $i"
  curl -k -o /dev/null -w "%{http_code}\n" https://staging.bestande.ch/en/api/courses/51110641/ratings
done
