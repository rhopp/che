#!/usr/bin/env bash
exit 0
echo "Generating index.ts file..."
echo "export * from './inversify.config';
export * from './inversify.types';
export * from './TestConstants';
" > index.ts

listOfDirs="driver utils pageobjects testsLibrary"
listOfExcludes="./driver/CheReporter.ts"
for dir in $listOfDirs
do
  files=$(find ./$dir -type f | sort)
  for file in $files
  do  
    case $file in *ts)
      for excludedFile in $listOfExcludes
      do
        if [ $excludedFile == $file ]; then
          continue
        else
          end=$((${#file}-3))
          file_without_ending=${file:0:end}
          echo "export * from '$file_without_ending';" >> index.ts
        fi
      done
      ;;
      *)
      echo "Excluding file $file - not a typescript file"
      ;;
    esac
  done
done
