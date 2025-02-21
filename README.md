# Running Bestande locally (first time setup)
1. Install Node.JS and Yarn on your system the official node version for this project is: 20.6.1
2. Clone repository and run `yarn install`
3. Install MongoDB to your computer and create database bestande
4. Create a database-collection called `modules` and import the file `db_backup_data/updated_modules_including_FS24_final.json`
5. Create a database-collection called `ratings` and import the file `db_backup_data/updated_ratings_including_FS24_final.json`
6. Copy the `web/.env.example` file to `web/.env` and fill in the SECRET variables (only really AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are needed)
7. Map 127.0.0.1 to the domain `staging.bestande.ch` under `/etc/hosts` (with `sudo nano /etc/hosts`) by adding the line: `127.0.0.1       staging.bestande.ch`to the `

```{/etc/hosts}

```

In **Windows 10** the hosts file is located at `c:\Windows\System32\Drivers\etc\hosts`

On **MacOS** you might want to flush the DNS cache to reflect your changes immediately 

`sudo killall -HUP mDNSResponder`

On Windows: `ipconfig /flushdns`

## Generating SSL keys for https

Run following command in the root directory of the project to get a new keypair.

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

Then start the website as follows, depending on the OS you might need to run it as root:

`PORT=443 npm run dev`

On Windows for me doing something like: `set PORT=443 && npm run dev` didn't work so I had to set the environment variable PORT=433 in the .env file in the root of the project and in the `web` directory 

if the npm command is not found when running as root because you use asdf run it as follows:

`sudo -E PORT=443 npm run dev`

Open `https://staging.bestande.ch` in your browser.

## Start the website

- Start website: `npm run dev`
- Open `http://localhost:3000`

## Use Docker to Containerize:
- Command to build the docker image inside of the /Bestande directory: `docker build --tag bestande:latest .`
- Command to run the docker image: `docker run -d -p 3000:3000 -e ´[add a .env variable, need to repeat -e for each .env variable] bestande:latest`
- Remove the -d flag to not run it in detached mode -> to see the output directly without having to use `docker logs bestande:latest`
- To stop the docker container use `docker stop bestande:latest`

## Environment Variables:
- For the webapp set them in the .env file in the /web directory
- In the Frontend the .env variables have to be added to the `web/webpack.config.js`file before being able to access them (under plugins -> process -> env) 
**Important** for **deployment** in the Frontend: Set .env variables in the digitalocean settings and also add them in the `scripts/build-web.sh` file and to the `Dockerfile` (look at the ones already there)
- In the backend they can be accessed directly

| Environment Variable |  LOCALHOST | STAGING (main-branch) | PROD (bestande.ch) | DEFAULT    | 
| --------------------------| ----- | --- | ---- | ---------- |
| NODE_ENV  |  development  | production | production | development |
| SECRET_KEY | must be set manually, can never be changed | must be set manually, can never be changed | must be set manually, can never be changed | must be set manually, can never be changed | 
| DOMAIN  |  http://localhost:3000 | https://staging.bestande.ch | https://bestande.ch | http://localhost.ch |
| REACT_APP_ONESIGNAL_APP_ID  |  ef01fdd5-ab27-4725-ab26-d1f924aa5ef1 | 4d454410-4cd5-41ca-b543-4a93d66a36e1 | d8f35f4d-52a5-4ac1-b052-f58044693d18 | ef01fdd5-ab27-4725-ab26-d1f924aa5ef1 |
| REACT_APP_ONESIGNAL_SAFARI_WEB_ID  |  web.onesignal.auto.40adfb09-7751-41be-9e4d-5711eb8f35a8 | web.onesignal.auto.6b31cc7e-8212-45ce-95eb-ed8c35d3e69c | web.onesignal.auto.34e4584e-b851-4129-9188-f0d7c790d3df | web.onesignal.auto.40adfb09-7751-41be-9e4d-5711eb8f35a8 |
| MONGODB_URI  |  mongodb://127.0.0.1:27017/bestande  | SECRET | SECRET | mongodb://127.0.0.1:27017/bestande |
| ALGOLIA_PRIVATE_KEY | SECRET | SECRET | SECRET | SECRET |
| AWS_ACCESS_KEY_ID | SECRET | SECRET | SECRET | SECRET |
| AWS_SECRET_ACCESS_KEY | SECRET | SECRET | SECRET | SECRET |
| PORT | 443 | not-needed | not-needed | 3000 |
| REACT_APP_OIDC_CLIENT_ID | bestande_production | bestande_production | bestande_production | bestande_production |
| REACT_APP_OIDC_REDIRECT_URI | https://staging.bestande.ch/login | https://staging.bestande.ch/login | https://bestande.ch/login | https://staging.bestande.ch/login |
| JWT_SECRET_KEY | DEV_JWT_SECRET_KEY | SECRET | SECRET | DEV_JWT_SECRET_KEY (only when in NODE_ENV=development) |



## Running the app (not needed for now)

- Run `cd app/ios && pod install`
- `npm run start-app` and open Xcode workspace in `app/ios` folder

## Check if everything works on the cloud:
- Run `npm run build-and-start`

## Hash emails of users
1. Set the .env variable `SECRET_KEY`<br>
**Important Note**: After hashing the secret key cannot be changed anymore -> this is due to the fact that after hashing we have no way to know which email address belongs to which hashed email address (which is a good thing)
2. (Optional) Set the .env variable `MONGODB_URI` to be able to hash another DB than your local one (e.g. prod/staging)
3. Run the command: `npx ts-node web/src/tasks/hash-all-user-emails.ts`

**Remark:** The `SECRET_KEY` is an added security measure, compared to "normal" hashing (where there are no keys involved).<br>
If an attacker knows our `SECRET_KEY` the hashing will be like "normal" hashing.<br>
So even if an attacker knows the `SECRET_KEY` and has access to our DB he still won't be able to know the email addresses. 

## Connect app to local backend

- In `core/models/domain.ts`, the domain `https://api.bestande.ch` is hardcoded. Change it to `http://localhost:3000/api`.

## Documentation of API Endpoints
To generate an updated version of the endpoints first comment out the line `"router.use('/chat', chatRouter);"` in the `web/src/api/index.ts` file, after this, execute: `npm run swagger-autogen` 
This command will create the `web/src/swagger-output.json` file which is automatically available on `localhost:3000/api/doc` when running the web-app.


### Using Angolia Search

Under Algolia -> Index -> Configuration -> Facets: Add "university" and "faculty"<br>
Under Algolia -> Index -> Searchable attributes: Add: "name", "translatedNames.value", "short_name" and "courseCode" <br>

How to automatically update the Algolia "modules" Index: <br>
1. In the .env file in the root folder of the repo add the variable `ALGOLIA_PRIVATE_KEY` which can be found on the Algolia website
2. (Optional): In the .env file in the root folder of the repo add the variable `MONGODB_URI` to use a different DB than your local one
3. In the file `scripts/upload-algolia.ts` set the variables `ALGOLIA_INDEX_NAME` and `APPLICATION_ID`.
4. In the file `web/src/components/inner.tsx`set the variable `ALGOLIA_INDEX_NAME` to the same one as in the previous step
5. Run the following command from the root folder of the repo (where the .env file is located): `npx ts-node scripts/update-search.ts`






## Update the UZH module directory

Open `web/src/tasks/create-update-uzh-tasks.ts` to define which semesters should be scraped.

`year = 2021, semester = 004` means FS22
`year = 2022, semester = 003` means HS22

Run the following script to scrape FS22 and HS22:

```
npx ts-node scripts/update-uzh-module-catalogue.ts
npx ts-node scripts/update-timetable.ts
```

Problem: You end up with two versions of BWL1:

http://localhost:3000/uzh/50038000 (HS21 and below)
http://localhost:3000/uzh/51110639 (HS22 and above)

A mapping needs to be created that changes `51110639` -> `50038000` before it gets written to the database.

## Manual Mapping of Modules and Ratings:
There is a Google Spreadsheet: https://docs.google.com/spreadsheets/d/1u_mvLVyzRoyrHVJ5I4FyHW73fOvJ9-AvWyBfa6GmBGE/edit#gid=0 where the wrong modules are listed.
To then map the old module to the new module inclusive the rating, the old uni_identifier and the new uni_identifier must be passed into the arrays of `web/src/tasks/remap-modules-and-ratings-manual.ts`.
Multiple mappings can be done at once, but make sure the order of the uni_identifier is correct -> otherwise modules get mapped wrong.
To then perform the mapping execute `npx ts-node web/src/tasks/remap-modules-and-ratings-manual.ts` you can also set the Database via the .env file in the root of the /web folder directory (e.g.: /Desktop/Bestande/web/.env). The entry name is MONGODB_URI
After the mapping the old -> removed modules also needs to be removed from Algolia: https://dashboard.algolia.com/

## Mapping of Modules and Ratings
There is a mapper implemented in `web\src\tasks\remap-modules-and-ratings.ts` which needs two database collections to work: `modules` (which needs to be fetched via the module scraper) and `ratings` (which can be downloaded from bestande.ch). It can be started with the command: `npx ts-node web\src\tasks\remap-modules-and-ratings.ts`
The script then updates both collections to the new mapping and also updates the schema of `ratings` which was modified by Jonny when uploaded to bestande.ch (probably to anonymize the ratings)

The mapping script works like this: It goes through all modules, if it finds multiple modules with the same `short_name` it first checks if those modules have overlapping semesters. If they don't have overlapping semesters, all modules with the same `short_name` are merged/mapped to the most recent module by appending all semesters to this most recent module. In the end `uni_identifier` is still a primary key after the mapping. If the modules have overlapping semesters (which shouldn't be the case if its `short_name` is unique) they are not merged.

An example: if a module has shortname "Bachelor Thesis", but there are multiple with different "uni_identifiers" and some semesters are overlapping, it won't merge them to one single "uni_identifier" since they occur in overlapping semesters.
On the other hand a module with `short_name` "Betriebswirtschaftslehre I" which doesnt have any overlapping semesters gets its semesters merged into the most recent "uni_identifier" of all modules with `short_name` "Betriebswirtschaftslehre I"

## Pushing changes to production
1. Create a pull request on GitHub with the main as the "compare branch" and the production branch as the "base" branch.
2. Review the changes
3. Merge using the option "Rebase and merge"

## VSCode Debugging
To debug the web app use the following configuration:
         
		{
			"type": "node",
			"request": "launch",
			"name": "Launch Web App",
			"runtimeArgs": ["-r", "ts-node/register"],
			"program": "${workspaceFolder}/web/src/index.ts",
			"cwd": "${workspaceFolder}/web",
			"env": {
				"NODE_ENV": "development"
			},
			"console": "integratedTerminal",
			"internalConsoleOptions": "openOnSessionStart",
			"restart": true
		}



To debug a script:

		{
            "type": "node",
			"request": "launch",
			"name": "Launch Single Script",
			"runtimeArgs": ["-r", "ts-node/register"],
			"program": "${workspaceFolder}/path/to/script.ts"
		}
